"use strict";

const { StatusCodes } = require("http-status-codes");
const { LogicalException } = require("@adonisjs/generic-exceptions");
const message = "Transaksi belum dibayar";
const code = "E_TRANSACTION_NOT_PAID";
const status = StatusCodes.CONFLICT;

class TransactionNotPaidException extends LogicalException {
  constructor() {
    super(message, status, code);
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = TransactionNotPaidException;
