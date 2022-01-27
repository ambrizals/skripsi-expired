"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Pengiriman extends Model {
  static get table() {
    return "pengiriman";
  }

  Transaksi() {
    return this.belongsTo("App/Models/Transaksi/Transaksi", "transaksi", "id");
  }

  Pengirim() {
    return this.belongsTo("App/Models/Karyawan/Karyawan", "pengirim", "id");
  }


}

module.exports = Pengiriman;
