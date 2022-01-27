"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Pelanggan extends Model {
  static get table() {
    return "pelanggan";
  }

  Transaksi() {
    return this.hasMany("App/Models/Transaksi/Transaksi", "id", "pelanggan");
  }
}

module.exports = Pelanggan;
