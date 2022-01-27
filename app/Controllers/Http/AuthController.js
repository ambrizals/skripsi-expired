"use strict";
const { StatusCodes } = require("http-status-codes");
const faker = require('faker');

const Karyawan = use('App/Models/Karyawan/Karyawan');
const Hash = use("Hash");
const AuthService = use("App/Services/AuthService");
const HttpService = use("HttpService");
const jwt = use("JwtService");
const nexmo = use('App/Helpers/nexmo');

class AuthController extends HttpService {
  constructor() {
    super();
    this.authService = new AuthService();
    this.jwt = new jwt();
  }

  async generate({ request, response }) {
    const { username, password } = request.only(["username", "password"]);
    const _data = await Karyawan.findByOrFail('username', username);

    // Check if employee is active
    if (_data.is_active === 1) {
      const data = _data.toJSON();
      const _jabatan = await _data.jabatan().first();
      const jabatan = _jabatan.toJSON()
      const user = {
        id: data.id,
        username: data.username,
        jabatan: jabatan.name,
        role: data.role
      }

      const passcode = _data.$attributes.password;
      if (await Hash.verify(password, passcode)) {
        const jwt = this.jwt.generate({
          ...user,
          jabatan: {
            isOffice: jabatan.isOffice,
            isOwner: jabatan.isOwner
          }
        }).make();
        return this.payload(jwt)
          .request(request)
          .status(StatusCodes.ACCEPTED)
          .res(response);
      } else {
        return this.payload({
          message: "Password yang anda masukkan salah !",
        })
          .request(request)
          .status(StatusCodes.UNAUTHORIZED)
          .res(response);
      }
    } else {
      return this.payload({
        message: 'Akun anda tidak aktif, harap hubungi pemilik atau admin untuk mengaktifkan akun'
      }).request(request).status(StatusCodes.UNAUTHORIZED).res(response);
    }

  }

  async check({ response, request }) {
    const header = request.headers();
    const data = await this.authService.getUser(header["x-auth-token"]);
    const user = await Karyawan.findOrFail(data.id);

    if(user.is_active === 1) {
      const jabatan = await user.jabatan().first();
      return this.payload({
        ...data,
        jabatan
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } else {
      return this.payload({
        message: 'Akun anda tidak aktif, harap hubungi pemilik atau admin untuk mengaktifkan akun'
      }).request(request).status(StatusCodes.UNAUTHORIZED).res(response);
    }
  }

  async generateToken({ auth }) {
    return await auth.authenticator("employee").generate(data);
  }

  async updateProfile({ request, response }) {
    const header = request.headers();
    const req = request.all();
    const currentUser = await this.authService.getUser(header['x-auth-token']);
    const karyawan = await Karyawan.findOrFail(currentUser.id);
    karyawan.merge(req);
    await karyawan.save();

    const data = await this.authService.findUser(karyawan.username);

    const jwt = this.jwt.generate(data).make();

    return this.payload({
      newToken: jwt.token,
      message: 'Data berhasil diperbarui !'
    }).request(request).status(StatusCodes.OK).res(response);
  }

  async changePassword({ request, response }) {
    const header = request.headers();
    const req = request.all();
    const currentUser = await this.authService.getUser(header['x-auth-token']);

    const karyawan = await Karyawan.findOrFail(currentUser.id);

    if (await Hash.verify(req.current, karyawan.password)) {
      const karyawan = await Karyawan.findOrFail(currentUser.id);
      karyawan.password = req.password;
      await karyawan.save();

      const data = karyawan.toJSON();
      const _jabatan = await karyawan.jabatan().first();
      const jabatan = _jabatan.toJSON()
      const user = {
        id: data.id,
        username: data.username,
        jabatan: jabatan.name,
        role: data.role
      }      

      const jwt = this.jwt.generate({
        ...user,
        jabatan: {
          isOffice: jabatan.isOffice,
          isOwner: jabatan.isOwner
        }
      }).make();      

      return this.payload({
        newToken: jwt.token,
        message: 'Password berhasil diperbarui !'
      }).request(request).status(StatusCodes.OK).res(response);
    } else {
      return this.payload({
        message: "Password lama yang anda masukkan salah !"
      }).request(request).status(StatusCodes.BAD_REQUEST).res(response);
    }

  }

  async forgotPassword({ request, response }) {
    const sms = new nexmo();
    const req = request.all();
    const karyawan = await Karyawan.query().where('username',  req.username).where('phone_number', req.phone).first();
    if(karyawan) {
      const resetPasscode = faker.random.number({min: 100000, max: 999999});
      karyawan.password = resetPasscode.toString();
      await karyawan.save();
      const smsMessage = 'Password akun bbd manager anda telah diubah menjadi '+ resetPasscode.toString();
      sms.publish(smsMessage, karyawan.phone_number);
      return this.payload({
        message: 'Password terbaru akan dikirim ke nomor telepon'
      }).request(request).status(StatusCodes.OK).res(response);
    } else {
      return this.payload({
        message: 'Pengguna atau nomor telepon tidak ditemukan'
      }).request(request).status(StatusCodes.BAD_REQUEST).res(response);
    }
  }

  async getProfile({ request, response }) {
    const header = request.headers();
    const currentUser = await this.authService.getUser(header['x-auth-token']);
    const _karyawan = await Karyawan.query().with('jabatan').where('id', currentUser.id).first();
    const karyawan = _karyawan.toJSON();
    delete karyawan.password;
    return this.payload(karyawan).request(request).status(StatusCodes.OK).res(response);
  }
}

module.exports = AuthController;
