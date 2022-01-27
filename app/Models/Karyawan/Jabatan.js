"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Env = use("Env");
const OwnerException = use("App/Exceptions/OwnerRestrictionException");

class Jabatan extends Model {
  static get table() {
    return "karyawan_jabatan";
  }

  static boot() {
    super.boot();
    this.addHook("beforeCreate", async (roleInstance) => {
      // if (Env.get("NODE_ENV") == "production") {
      //   if (roleInstance.isOwner) {
      //     throw new OwnerException();
      //   }
      // }
    });
  }

  karyawan() {
    return this.hasOne("App/Models/Karyawan/Karyawan", "id", "role");
  }
}

module.exports = Jabatan;
