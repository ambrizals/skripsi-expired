"use strict";
const AuthService = use("AuthService");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Jwt {
  constructor() {
    this.auth = new AuthService();
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {
    // call next to advance the request
    const header = request.headers();

    await this.auth.getUser(header["x-auth-token"]);
    await next();
  }

  async wsHandle({ request }, next) {
    const req = request.get();

    await this.auth.getUser(req.token);
    await next();
  }
}

module.exports = Jwt;
