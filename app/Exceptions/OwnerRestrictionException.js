"use strict";

const { StatusCodes } = require("http-status-codes");
const message = "Akses ditolak";
const code = "EEEE_NGAPAIN";
const status = StatusCodes.UNAUTHORIZED;

const { LogicalException } = require("@adonisjs/generic-exceptions");

class OwnerRestrictionException extends LogicalException {
  constructor() {
    super(message, status, code);
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = OwnerRestrictionException;
