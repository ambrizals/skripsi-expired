"use strict";
const { StatusCodes } = require("http-status-codes");

const Detail = use("App/Models/Transaksi/Detail");
const DetailService = use("App/Services/Transaksi/DetailService");
const HttpService = use("HttpService");

class DetailController extends HttpService {
  constructor() {
    super();
    this.detailService = new DetailService();
  }

  async show ({ request, response, params }) {
    const data = await Detail.query()
      .with("ProdukDetail", (builder) => {
        builder.select("id", "name");
      })
      .where("transaksi", params.id)
      .orderBy("created_at", "desc")
      .fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store ({ request, response, params }) {
    /***
     * Request payload include
     * Relation Entity = Product ID (produk) / Custom is including services (Name)
     * main Entity = Jenis, qty, harga, deskripsi, status
     *
     * Too see more note can see on transaksi detail migration.
     * */

    const req = request.all();
    await this.detailService.single().create(req, params.id);

    return this.payload({
      message: "Data berhasil dimasukkan !",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async massStore ({ request, response, params }) {
    /***
     * Request payload include array
     * Relation Entity = Product ID (produk) / Custom is including services (Name)
     * main Entity = Jenis, qty, harga, deskripsi, status
     *
     * Too see more note can see on transaksi detail migration.
     * */
    const req = request.all();
    await this.detailService.multiple().create(req.data, params.id);
    return this.payload({
      message: "Data berhasil dimasukkan !",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async update ({ request, response, params }) {
    const req = request.all();
    const update = await this.detailService.updateDetail(req, params.id);
    if (update) {
      return this.payload({
        message: "Data berhasil diperbarui",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } else {
      return this.payload({
        message: "Terjadi kesalahan, transaksi dibatalkan",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    }
  }

  async destroy ({ request, response, params }) {
    const deleteData = await this.detailService.deleteDetail(params.id);
    if (deleteData.status == "locked") {
      return this.payload({
        message:
          "Transaksi tidak dapat dihapus setelah transaksi telah dibayarkan !",
      })
        .request(request)
        .status(StatusCodes.LOCKED)
        .res(response);
    } else if (deleteData.status == "success") {
      return this.payload({
        message: "Detail transaksi telah dihapus",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } else {
      return this.payload({
        message: "Terjadi kesalahan !",
      })
        .request(request)
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .res(response);
    }
  }
}

module.exports = DetailController;
