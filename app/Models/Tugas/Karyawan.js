"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Karyawan extends Model {
  static get table() {
    return "tugas_karyawan";
  }

  Tugas() {
    return this.belongsTo("App/Models/Tugas", "tugas", "id");
  }

  Karyawan() {
    return this.belongsTo("App/Models/Karyawan/Karyawan", "karyawan", "id");
  }

  CreatedBy() {
    return this.belongsTo('App/Models/Karyawan/Karyawan', 'created_by', 'id');
  }

  Pekerjaan () {
    return this.belongsTo("App/Models/Pekerjaan", "pekerjaan", "id");
  }

  RevokeBy() {
    return this.belongsTo("App/Models/Karyawan/Karyawan", "revokeBy", "id");
  }
}

module.exports = Karyawan;
