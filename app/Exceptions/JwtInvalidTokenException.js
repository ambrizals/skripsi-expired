"use strict";

const { StatusCodes } = require("http-status-codes");
const { LogicalException } = require("@adonisjs/generic-exceptions");
const message = "Token tidak valid";
const code = "E_JWT_INVALID_TOKEN";
const status = StatusCodes.UNAUTHORIZED;

class JwtInvalidTokenException extends LogicalException {
  constructor() {
    super(message, status, code);
  }
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = JwtInvalidTokenException;
