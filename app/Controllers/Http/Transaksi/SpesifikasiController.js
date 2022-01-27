"use strict";

const { StatusCodes } = require("http-status-codes");

const Spesifikasi = use("App/Models/Transaksi/Detail/Spesifikasi");
const HttpService = use("HttpService");
const Database = use("Database");
const Logger = use("Logger");

class SpesifikasiController extends HttpService {
  async store({ request, response, params }) {
    const req = request.all();
    try {
      await Spesifikasi.create({
        transaksi_detail: params.id,
        name: req.name,
        value: req.value,
      });

      return this.payload({
        message: "Data berhasil di masukkan",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } catch (error) {
      return this.payload({
        message: "Terjadi kesalahan, silahkan muat data kembali",
        technical: error.code,
      })
        .request(request)
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .res(response);
    }
  }

  async show({ request, response, params }) {
    const data = await Spesifikasi.query()
      .where("transaksi_detail", params.id)
      .orderBy("created_at", "desc")
      .fetch();
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async update({ request, response, params }) {
    const data = await Spesifikasi.findOrFail(params.id);
    await data.merge(request.all());
    await data.save();

    return this.payload({
      message: "Data berhasil di ubah",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async destroy({ request, response, params }) {
    /**
     *
     * Delete condition :
     * When transaction is not finish to check or transaction item hasn't shipped to customer
     *
     */
    
    const data = await Spesifikasi.findOrFail(params.id);
    const trx = await Database.beginTransaction();
    try {
      const detail = await trx.from('transaksi_detail').where('id', data.transaksi_detail).first();
      const transaksi = await trx.from('transaksi').where('id', detail.transaksi).first();
      if (!(['waiting_shipping', 'on_shipping', 'received'].indexOf(transaksi.status.toLowerCase()) > -1)) {
        await trx.from('transaksi_detail_spesifikasi').where('id', params.id).delete();
        await trx.commit();
        return this.payload({
          message: "Spesifikasi berhasil di hapus !",
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
    } catch(err) {
      Logger.error("Spesifikasi Destroy Exception", err);
      await trx.rollback();
      return this.payload({
        message: "Terjadi kesalahan pada internal server.",
      })
        .request(request)
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .res(response);      
    }
  }
}

module.exports = SpesifikasiController;
