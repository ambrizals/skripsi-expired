"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class MaterialPengeluaran extends Model {
  static get table() {
    return "pekerjaan_material_pengeluaran";
  }
}

module.exports = MaterialPengeluaran;
