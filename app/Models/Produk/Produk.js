"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Produk extends Model {
  static get table() {
    return "produk";
  }

  spesifikasi() {
    return this.hasMany("App/Models/Produk/Spesifikasi", "id", "produk");
  }

  gambar() {
    return this.hasMany("App/Models/Produk/Gambar", "id", "produk");
  }
}

module.exports = Produk;
