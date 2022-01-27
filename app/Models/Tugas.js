"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Tugas extends Model {
  static get table () {
    return "tugas";
  }

  static get hidden() {
    return ['isDelete'];
  }

  Pekerjaan () {
    return this.belongsTo("App/Models/Pekerjaan", "pekerjaan", "id");
  }

  Penerima () {
    return this.belongsTo("App/Models/Karyawan/Jabatan", "penerima", "id");
  }

  // Karyawan () {
  //   return this.hasMany("App/Models/Tugas/Karyawan", "id", "karyawan");
  // }

  TransaksiDetail () {
    return this.belongsTo('App/Models/Transaksi/Detail', 'transaksi_detail', 'id');
  }

  CreatedBy () {
    return this.belongsTo('App/Models/Karyawan/Karyawan', 'created_by', 'id');
  }  
}

module.exports = Tugas;
