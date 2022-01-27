"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Pembayaran extends Model {
  static get table() {
    return "transaksi_pembayaran";
  }

  Transaksi() {
    return this.belongsTo("App/Models/Transaksi/Transaksi", "transaksi", "id");
  }

  Karyawan() {
    return this.belongsTo('App/Models/Karyawan/Karyawan', 'id_karyawan', 'id');
  }
}

module.exports = Pembayaran;
