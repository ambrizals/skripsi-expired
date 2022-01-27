"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Gambar extends Model {
  static get table() {
    return "transaksi_detail_gambar";
  }

  Detail() {
    return this.belongsTo(
      "App/Models/Transaksi/Detail",
      "transaksi_detail",
      "id"
    );
  }

  Transaksi() {
    return this.belongsToMany(
      "App/Models/Transaksi/Transaksi",
      "id",
      "transaksi"
    ).pivotTable("transaksi_detail");
  }
}

module.exports = Gambar;
