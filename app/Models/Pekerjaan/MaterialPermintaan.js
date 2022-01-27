'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MaterialPermintaan extends Model {
  static get table() {
    return 'pekerjaan_permintaan_material';
  }

  KaryawanData () {
    return this.belongsTo("App/Models/Karyawan/Karyawan", "karyawan", "id");
  }

  ExecutionerData () {
    return this.belongsTo('App/Models/Karyawan/Karyawan', 'executioner', 'id');
  }
}

module.exports = MaterialPermintaan
