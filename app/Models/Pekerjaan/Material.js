"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Material extends Model {
  static get table() {
    return "pekerjaan_material";
  }

  Pekerjaan() {
    return this.belongsTo("App/Models/Pekerjaan", "pekerjaan", "id");
  }

  Karyawan() {
    return this.belongsTo("App/Models/Karyawan/Karyawan", "karyawan", "id");
  }

  RequestBy() {
    return this.belongsTo('App/Models/Karyawan/Karyawan', 'requestBy', 'id');
  }
}

module.exports = Material;
