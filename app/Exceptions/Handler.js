"use strict";

const { StatusCodes } = require("http-status-codes");
const BaseExceptionHandler = use("BaseExceptionHandler");
const HttpService = use("HttpService");
const Logger = use("Logger");
/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  constructor() {
    super();
    this.ctl = new HttpService();
  }
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response }) {
    switch (error.code) {
      case "E_INVALID_JWT_TOKEN":
        return this.ctl
          .payload({
            message: "Token tidak valid",
          })
          .request(request)
          .status(StatusCodes.UNAUTHORIZED)
          .res(response);

      case "E_MISSING_DATABASE_ROW":
        return this.ctl
          .payload({
            message: "Data tidak ditemukan",
          })
          .request(request)
          .status(StatusCodes.NOT_FOUND)
          .res(response);

      default:
        Logger.error(error.message, error);

        return this.ctl
          .payload({
            message: error.message,
          })
          .request(request)
          .status(error.status)
          .res(response);
    }
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {}
}

module.exports = ExceptionHandler;
