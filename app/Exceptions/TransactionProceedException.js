"use strict";

const { StatusCodes } = require("http-status-codes");
const { LogicalException } = require("@adonisjs/generic-exceptions");
const message = "Transaksi sudah diproses, aksi tidak dapat dilakukan";
const code = "E_TRANSACTION_HAS_PROCEED";
const status = StatusCodes.CONFLICT;

class TransactionProceedException extends LogicalException {
  constructor() {
    super(message, status, code);
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = TransactionProceedException;
