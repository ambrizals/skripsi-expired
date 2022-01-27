"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");
const { StatusCodes } = require("http-status-codes");
const message = "Transaksi dibatalkan, karena terdapat data yang salah";
const code = "E_TRANSACTION_ROLLBACK";
const status = StatusCodes.BAD_REQUEST;

class TransactionRollbackException extends LogicalException {
  constructor() {
    super(message, status, code);
  }
  /**
   * Handle this exception by itself
   */
  // handle(error, { request, response }) {}
}

module.exports = TransactionRollbackException;
