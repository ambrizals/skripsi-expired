"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Spesifikasi extends Model {
  static get table() {
    return "transaksi_detail_spesifikasi";
  }

  Detail() {
    return this.belongsTo(
      "App/Models/Transaksi/Detail",
      "transaksi_detail",
      "id"
    );
  }
}

module.exports = Spesifikasi;
