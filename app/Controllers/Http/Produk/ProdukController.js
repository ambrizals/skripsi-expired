"use strict";
const { StatusCodes } = require("http-status-codes");
const randomString = require("randomstring")


const Drive = use("Drive");
const Produk = use("App/Models/Produk/Produk");
const Pekerjaan = use("App/Models/Pekerjaan");
const ProdukService = use("App/Services/Produk/ProdukService");
const Pagination = use("Pagination");
const HttpService = use("HttpService");
const Database = use('Database');
const RollbackException = use("App/Exceptions/TransactionRollbackException");
const Time = use("Time");
const Logger = use("Logger");


class ProdukController extends HttpService {
  constructor() {
    super();
    this.produkService = new ProdukService();
  }

  async index ({ request, response }) {
    const req = request.all();
    const { page, limit } = Pagination.create(req, req.limitpage);

    const produk = await this.produkService.paginate(page, limit).get(req, req.archive);

    return this.payload(produk)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async suggest ({ request, response }) {
    const req = request.all();
    const produk = await this.produkService.fetch().get(req);
    return this.payload(produk)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store ({ request, response }) {
    const req = request.all();
    const data = await Produk.create(req);

    return this.payload({
      message: "Data Produk Telah Dibuat !",
      result: data,
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async update ({ request, response, params }) {
    const data = await Produk.findOrFail(params.id);
    await data.merge(request.all());
    await data.save()

    return this.payload({
      message: "Data Produk Telah Diperbarui !",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async latestData ({ request, response }) {
    const data = await Produk.last();
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async postArchive ({ request, response, params }) {
    const data = await Produk.findOrFail(params.id);
    await data.merge({
      is_archive: true
    })
    await data.save()

    return this.payload({
      message: "Produk sudah diarsipkan"
    }).request(request)
      .status(StatusCodes.OK)
      .res(response)
  }

  async destroy ({ request, response, params }) {
    const data = await Produk.findOrFail(params.id);
    if (data.is_archive == true) {
      await data.delete();
      return this.payload({
        message: "Produk telah dihapus"
      }).request(request)
        .status(StatusCodes.OK)
        .res(response)
    } else {
      return this.payload({
        message: "Tidak dapat menghapus produk yang tidak diarsipkan"
      }).request(request)
        .status(StatusCodes.OK)
        .res(response)
    }
  }

  async importPekerjaan ({ request, response, params }) {
    const date = Time.currentTime();
    const pekerjaan = await Pekerjaan.findOrFail(params.id);
    const trx = await Database.beginTransaction();
    try {
      await trx.from('pekerjaan').where('id', pekerjaan.id).update({
        updated_at: date,
        productCreated: true
      })
      const detail = await trx.from('transaksi_detail').where('id', pekerjaan.transaksi_detail).first();
      const produk = await trx.insert({
        name: `${detail.name} #${randomString.generate({
          length: 4,
          capitalization: 'uppercase'
        })}`,
        price: detail.price,
        cover: detail.cover,
        created_at: date,
        updated_at: date
      }).into('produk');
      const spesifikasi = await trx.from('transaksi_detail_spesifikasi').where('transaksi_detail', pekerjaan.transaksi_detail);
      const gambar = await trx.from('transaksi_detail_gambar').where('transaksi_detail', pekerjaan.transaksi_detail);

      if(spesifikasi.length > 0) {
        for (let i = 0; i < spesifikasi.length; i++) {
          await trx.insert({
            produk: produk,
            name: spesifikasi[i].name,
            value: spesifikasi[i].value,
            created_at: date,
            updated_at: date
          }).into('produk_spesifikasi');
        }        
      }
      if(gambar.length > 0) {
        for (let i = 0; i < gambar.length; i++) {
          await Drive.copy(`transaksi/${gambar[i].name}`, `product/${gambar[i].name}`)
          await Drive.copy(`transaksi/${gambar[i].name}`, `product/thumb/${gambar[i].name}`)

          await trx.insert({
            produk: produk,
            name: gambar[i].name,
            created_at: date,
            updated_at: date
          }).into('produk_gambar');
        }        
      }

      await trx.commit();
      return this.payload({
        message: "Pekerjaan berhasil di masukkan ke produk"
      }).request(request).status(StatusCodes.OK).res(response);
    } catch (err) {
      Logger.error("Import Pekerjaan Fail", err);
      await trx.rollback();
      throw new RollbackException();
    }
  }
}

module.exports = ProdukController;
