"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Pekerjaan extends Model {
  static get table() {
    return "pekerjaan";
  }

  DetailTransaksi() {
    return this.belongsTo(
      "App/Models/Transaksi/Detail",
      "transaksi_detail",
      "id"
    );
  }

  Spesifikasi() {
    return this.hasMany(
      "App/Models/Transaksi/Detail/Spesifikasi",
      "transaksi_detail",
      "transaksi_detail"
    );
  }

  Gambar() {
    return this.hasMany(
      "App/Models/Transaksi/Detail/Gambar",
      "transaksi_detail",
      "transaksi_detail"
    );
  }

  Pengeluaran() {
    return this.hasMany("App/Models/Pekerjaan/Pengeluaran", "id", "pekerjaan");
  }

  Material() {
    return this.hasMany("App/Models/Pekerjaan/Material", "id", "pekerjaan");
  }

  CreatedBy() {
    return this.belongsTo('App/Models/Karyawan/Karyawan', 'created_by', 'id');
  }
}

module.exports = Pekerjaan;
