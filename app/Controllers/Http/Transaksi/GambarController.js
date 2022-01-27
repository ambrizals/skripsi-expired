"use strict";

const { StatusCodes } = require("http-status-codes");

const Gambar = use("App/Models/Transaksi/Detail/Gambar");
const HttpService = use("HttpService");
const Upload = use("UploadImage");
const Drive = use("Drive");
const Database = use('Database');
const Time = use("Time");
const RollbackException = use("App/Exceptions/TransactionRollbackException");
const Logger = use("Logger");

class GambarController extends HttpService {
  constructor() {
    super();
    this.upload = new Upload();
  }

  async store ({ request, response, params }) {
    const req = request.all();
    const date = Time.currentTime();

    const image = await request.file("image", {
      types: ["image"],
    });

    if (image) {
      const trx = await Database.beginTransaction();
      try {
        const _upload = await this.upload.transaction().create(image);
        const transaksi_detail = await trx.from('transaksi_detail').where('id', params.id).first();

        if(transaksi_detail.jenis !== 0) {
          if (transaksi_detail.cover == null) {
            await trx.from('transaksi_detail').where('id', params.id).update({
              cover: _upload,
              updated_at: date
            });
          }
        }

        await trx.insert({
          transaksi_detail: params.id,
          name: _upload,
          isAssets: JSON.parse(req.isAssets),
          created_at: date,
          updated_at: date
        }).into('transaksi_detail_gambar');

        await trx.commit();

        return this.payload({
          message: "Gambar berhasil di upload",
          filename: _upload,
        })
          .request(request)
          .status(StatusCodes.OK)
          .res(response);
      } catch (err) {
        Logger.error('Image Transaction Exception', err);
        await trx.rollback();
        throw new RollbackException();
      }
    } else {
      return this.payload({
        message: "Tidak ada gambar yang dikirim !",
      })
        .request(request)
        .status(StatusCodes.BAD_REQUEST)
        .res(response);
    }
  }

  async show ({ request, response, params }) {
    const data = await Gambar.query()
      .where("transaksi_detail", params.id)
      .orderBy("created_at", "desc")
      .fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async destroy ({ request, response, params }) {
    /**
     * Delete Condition :
     * When transaction is not finish
     *
     */
    const date = Time.currentTime();
    const data = await Gambar.findOrFail(params.id);
    if(data.isAssets === 1) {
      return this.payload({
        message: "Gambar tidak dapat dihapus karena merupakan produk !",
      })
        .request(request)
        .status(StatusCodes.NOT_ACCEPTABLE)
        .res(response);
    } else {
      const trx = await Database.beginTransaction();
      try {
        const detail = await trx.from('transaksi_detail').where('id', data.transaksi_detail).first();
        const transaksi = await trx.from('transaksi').where('id', detail.transaksi).first();
        if ([['waiting_shipping', 'on_shipping', 'received'].indexOf(transaksi.status.toLowerCase() > -1)]) {
          if(data.name === detail.cover) {
            await trx.from('transaksi_detail').where('id', data.transaksi_detail).update({
              updated_at: date,
              cover: null
            })
          }

          await trx.from('transaksi_detail_gambar').where('id', params.id).delete();
          await trx.commit();
          await Drive.delete("transaksi/" + data.name);
          await Drive.delete("thumb/transaksi/" + data.name);
          return this.payload({
            message: "Gambar berhasil di hapus !",
          })
            .request(request)
            .status(StatusCodes.OK)
            .res(response);
        } else {
          await trx.rollback();
          return this.payload({
            message: "Transaksi telah diproses, tidak dapat dihapus !",
          })
            .request(request)
            .status(StatusCodes.OK)
            .res(response);
        }
      } catch (err) {
        Logger.error("Destroy Image Exception", err);
        await trx.rollback();
        return this.payload({
          message: "Terjadi kesalahan pada server",
        })
          .request(request)
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .res(response);        
      }    
    }
  }

  async updateCover ({ request, response, params }) {
    const gambar = await Gambar.findOrFail(params.id);
    await gambar.Detail().update({
      cover: gambar.name,
    });

    return this.payload({
      message: "Cover berhasil diatur",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }
}

module.exports = GambarController;
