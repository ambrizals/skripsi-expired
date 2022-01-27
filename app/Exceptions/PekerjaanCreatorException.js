"use strict";

const { StatusCodes } = require("http-status-codes");
const { LogicalException } = require("@adonisjs/generic-exceptions");
const message =
  "Transaksi yang anda pilih sudah di proses atau belum melakukan pembayaran";
const code = "E_PEKERJAAN_CONFLICT";
const status = StatusCodes.CONFLICT;

class PekerjaanCreatorException extends LogicalException {
  constructor() {
    super(message, status, code);
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = PekerjaanCreatorException;
