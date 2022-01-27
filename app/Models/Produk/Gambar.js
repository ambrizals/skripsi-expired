"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Gambar extends Model {
  static get table () {
    return "produk_gambar";
  }

  produkData () {
    return this.belongsTo("App/Models/Produk/Produk", "produk", "id");
  }
}

module.exports = Gambar;
