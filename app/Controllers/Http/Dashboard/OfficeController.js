'use strict'
const { StatusCodes } = require('http-status-codes');
const HttpService = use('HttpService');
const Transaksi = use('App/Models/Transaksi/Transaksi');
const Pekerjaan = use('App/Models/Pekerjaan');
const Pengiriman = use('App/Models/Pengiriman');

class OfficeController extends HttpService {
  constructor() {
    super();
  }

  async transaksi ({ request, response }) {
    const transaksi = await Transaksi.query()
      .with("Pelanggan", (builder) => builder.select("id", "name"))
      .limit(5).orderBy('updated_at', 'desc').fetch();
    return this.payload(transaksi).request(request).status(StatusCodes.OK).res(response);
  }

  async pekerjaan ({ request, response }) {
    const pekerjaan = await Pekerjaan.query()
      .with("DetailTransaksi", (builder) => builder.select("id", "cover", "jenis"))
      .limit(5).orderBy('updated_at', 'desc').fetch();
    return this.payload(pekerjaan).request(request).status(StatusCodes.OK).res(response);
  }

  async pengirimanCount ({ request, response }) {
    const pengiriman = await Pengiriman.query().where('status', 0).count();
    return this.payload({
      jumlah: pengiriman[0]['count(*)']
    }).request(request).status(StatusCodes.OK).res(response);
  }

  async transaksiCount ({ request, response }) {
    const transaksi = await Transaksi.query().count();
    return this.payload({
      jumlah: transaksi[0]['count(*)']
    }).request(request).status(StatusCodes.OK).res(response);
  }

  async pekerjaanCount ({ request, response }) {
    const pekerjaan = await Pekerjaan.query().where('isReady', 0).count();
    return this.payload({
      jumlah: pekerjaan[0]['count(*)']
    }).request(request).status(StatusCodes.OK).res(response);
  }
}

module.exports = OfficeController
