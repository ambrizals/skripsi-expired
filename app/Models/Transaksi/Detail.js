"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Detail extends Model {
  static get table () {
    return "transaksi_detail";
  }

  Transaksi () {
    return this.belongsTo("App/Models/Transaksi/Transaksi", "transaksi", "id");
  }

  ProdukDetail () {
    return this.belongsToMany(
      "App/Models/Produk/Produk",
      "transaksi_detail",
      "produk",
      "id",
      "id"
    ).pivotTable("transaksi_detail_produk");
  }

  Produk () {
    return this.hasOne(
      "App/Models/Transaksi/Detail/Produk",
      "id",
      "transaksi_detail"
    );
  }

  Gambar () {
    return this.hasMany(
      "App/Models/Transaksi/Detail/Gambar",
      "id",
      "transaksi_detail"
    );
  }

  Spesifikasi () {
    return this.hasMany(
      "App/Models/Transaksi/Detail/Spesifikasi",
      "id",
      "transaksi_detail"
    );
  }
}

module.exports = Detail;
