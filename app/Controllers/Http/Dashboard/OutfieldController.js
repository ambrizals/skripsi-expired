'use strict'
const { StatusCodes } = require('http-status-codes');
const Tugas = use('App/Models/Tugas');
const HttpService = use("HttpService");
const AuthService = use("AuthService");

class OutfieldController extends HttpService {
  constructor() {
    super();
    this.authService = new AuthService();
  }

  async tugas ({ request, response }) {
    const header = request.headers();
    const karyawan = await this.authService.getUser(header["x-auth-token"]);
    const data = await Tugas.query()
      .with('TransaksiDetail')
      .where("penerima", karyawan.role)
      .where('isFinish', false)
      .orderBy("created_at", "desc")
      .limit(5)
      .fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }
}

module.exports = OutfieldController
