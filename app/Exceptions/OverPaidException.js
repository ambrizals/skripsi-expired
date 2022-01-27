'use strict'

const { LogicalException } = require("@adonisjs/generic-exceptions");
const { StatusCodes } = require("http-status-codes");
const message = "Transaksi ini telah lunas atau total pembayaran melebihi total keseluruhan transaksi.";
const code = "E_REJECT_ALREADY_PAID";
const status = StatusCodes.NOT_IMPLEMENTED;

class OverPaidException extends LogicalException {
  constructor() {
    super(message, status, code);
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = OverPaidException
