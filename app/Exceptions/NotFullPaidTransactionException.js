"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");
const { StatusCodes } = require("http-status-codes");
const message = "Konfirmasi tidak dapat dilakukan karena pembayaran belum diselesaikan.";
const code = "E_REJECT_COMPLETION_SHIPMENT";
const status = StatusCodes.BAD_REQUEST;

class NotFullPaidTransactionException extends LogicalException {
  constructor() {
    super(message, status, code);
  }
  /**
   * Handle this exception by itself
   */
  // handle(error, { request, response }) {}
}

module.exports = NotFullPaidTransactionException;
