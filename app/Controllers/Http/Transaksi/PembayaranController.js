"use strict";
const { StatusCodes } = require("http-status-codes");
const AuthService = use("AuthService");

const PembayaranService = use("App/Services/Transaksi/PembayaranService");
const Pembayaran = use("App/Models/Transaksi/Pembayaran");
const HttpService = use("HttpService");

class PembayaranController extends HttpService {
  constructor() {
    super();
    this.pembayaranService = new PembayaranService();
    this.authService = new AuthService();
  }

  async show({ request, response, params }) {
    const data = await Pembayaran.query().with('Karyawan', (builder) => {
      builder.select('id', 'fullname')
    }).where("transaksi", params.id).fetch();
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store({ request, response, params }) {
    const header = request.headers();
    const req = request.all();
    const karyawan = await this.authService.getUser(header["x-auth-token"]);
    const transaksi = await this.pembayaranService.makePayment(req, params.id, karyawan);

    if (transaksi) {
      return this.payload({
        message: "Pembayaran berhasil di simpan",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } else {
      return this.payload({
        message: "Terjadi kesalahan, silahkan buka log system",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    }
  }
}

module.exports = PembayaranController;
