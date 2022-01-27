"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Produk extends Model {
  static get table() {
    return "transaksi_detail_produk";
  }

  Detail() {
    return this.belongsTo(
      "App/Models/Transaksi/Detail",
      "transaksi_detail",
      "id"
    );
  }

  Produk() {
    return this.belongsTo("App/Models/Produk/Produk", "produk", "id");
  }
}

module.exports = Produk;
