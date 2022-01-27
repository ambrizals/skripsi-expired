"use strict";

const { StatusCodes } = require("http-status-codes");
const Gambar = use("App/Models/Produk/Gambar");
const Drive = use("Drive");
const Upload = use("UploadImage");
const HttpService = use("HttpService");
const Database = use('Database');
const Time = use("Time");
const RollbackException = use("App/Exceptions/TransactionRollbackException");
const Logger = use("Logger");

class GambarController extends HttpService {
  constructor() {
    super();
    this.upload = new Upload();
  }

  async show ({ request, response, params }) {
    const data = await Gambar.query().where("produk", params.id).fetch();
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store ({ request, response, params }) {
    const date = Time.currentTime();
    const image = await request.file("image", {
      types: ["image"],
    });
    const trx = await Database.beginTransaction();
    try {
      const _upload = await this.upload.product().create(image);
      const produk = await trx.from('produk').where('id', params.id).first();
      if (produk.cover == null) {
        await trx.from('produk').where('id', params.id).update({
          cover: _upload,
          updated_at: date
        });
      }

      await trx.insert({
        produk: params.id,
        name: _upload,
        created_at: date,
        updated_at: date
      }).into('produk_gambar');

      await trx.commit();

      return this.payload({
        message: 'Telah berhasil mengunggah gambar produk.'
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } catch (err) {
      Logger.error("Image Store Exception", err);
      await trx.rollback();
      throw new RollbackException();
    }
  }

  async destroy ({ request, response, params }) {
    const date = Time.currentTime();
    const data = await Gambar.findOrFail(params.id);
    const trx = await Database.beginTransaction();

    try {
      const produk = await trx.from('produk').where('id', data.produk).first();
      // Check when image is cover
      if(produk.cover === data.name) {
        await trx.from('produk').where('id', data.produk).update({
          updated_at: date,
          cover: null
        });
      }

      await Drive.delete("product/" + data.name);
      await Drive.delete("thumb/product/" + data.name);
      await trx.from('produk_gambar').where('id', params.id).delete();

      await trx.commit();
      
      return this.payload({
        message: "Gambar telah dihapus !",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);      
    } catch(err) {
      Logger.error('Image Destroy Exception', err);
      await trx.rollback();
      throw new RollbackException();
    }
  }

  async setCover ({ request, response, params }) {
    const gambar = await Gambar.findOrFail(params.id)
    const produk = await gambar.produkData().fetch()
    produk.cover = gambar.name
    await produk.save()
    return this.payload({
      message: 'Cover telah di set !'
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response)
  }
}

module.exports = GambarController;
