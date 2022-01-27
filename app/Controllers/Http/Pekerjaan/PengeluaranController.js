"use strict";
const { StatusCodes } = require("http-status-codes");

const Pengeluaran = use("App/Models/Pekerjaan/Pengeluaran");

const HttpService = use("HttpService");
const AuthService = use("AuthService");

const PekerjaanDestroyer = use("App/Services/Pekerjaan/PengeluaranDestroyer");

class PengeluaranController extends HttpService {
  constructor() {
    super();
    this.authService = new AuthService();
    this.destroyer = new PekerjaanDestroyer();
  }

  async show({ request, response, params }) {
    const data = await Pengeluaran.query()
      .where("pekerjaan", params.id)
      .with("Karyawan", (builder) => {
        builder.select('id', 'fullname')
      })
      .orderBy("created_at", "desc")
      .fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store({ request, response, params }) {
    const header = request.headers();
    const user = await this.authService.getUser(header["x-auth-token"]);
    const req = Object.assign(request.all(), {
      pekerjaan: params.id,
      karyawan: user.id,
      isMaterial: false,
    });
    await Pengeluaran.create(req);

    return this.payload({
      message: "Data Pengeluaran Telah Ditambah !",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async destroy({ request, response, params }) {
    await this.destroyer.execute(params.id);

    return this.payload({
      message: "Pengeluaran berhasil di hapus !",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }
}

module.exports = PengeluaranController;
