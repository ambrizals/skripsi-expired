"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Spesifikasi extends Model {
  static get table() {
    return "produk_spesifikasi";
  }

  produk() {
    return this.belongsTo("App/Models/Produk/Produk", "produk", "id");
  }
}

module.exports = Spesifikasi;
