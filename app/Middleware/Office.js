"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");
const AuthService = use("AuthService");

class Office {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */

  constructor() {
    this.ctl = new HttpService();
    this.auth = new AuthService();
  }
  async handle({ request, response }, next) {
    // call next to advance the request
    const header = request.headers();
    const payload = await this.auth.getUser(header["x-auth-token"]);
    // console.log(payload);
    if (payload.jabatan.isOwner == 1 || payload.jabatan.isOffice == 1) {
      await next();
    } else {
      return this.ctl
        .payload({
          message: "Hanya Office dan Owner yang dapat mengakses ini",
        })
        .request(request)
        .status(StatusCodes.UNAUTHORIZED)
        .res(response);
    }
  }
}

module.exports = Office;
