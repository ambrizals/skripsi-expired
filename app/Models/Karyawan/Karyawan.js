"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Hash = use("Hash");

class Karyawan extends Model {
  static get table() {
    return "karyawan";
  }

  static get hidden() {
    return ['password'];
  }

  static boot() {
    super.boot();
    this.addHook("beforeSave", async (employeeInstance) => {
      if (employeeInstance.dirty.password) {
        employeeInstance.password = await Hash.make(employeeInstance.password);
      }
    });
  }

  jabatan() {
    return this.belongsTo("App/Models/Karyawan/Jabatan", "role", "id");
  }

  Pembayaran() {
    return this.hasMany('App/Models/Transaksi/Pembayaran/', 'id', 'id_transaksi');
  }
}

module.exports = Karyawan;
