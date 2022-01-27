"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Pengeluaran extends Model {
  static get table() {
    return "pekerjaan_pengeluaran";
  }

  Pekerjaan() {
    return this.belongsTo("App/Models/Pekerjaan", "pekerjaan", "id");
  }

  Karyawan() {
    return this.belongsTo('App/Models/Karyawan/Karyawan', 'karyawan', 'id');
  }
}

module.exports = Pengeluaran;
