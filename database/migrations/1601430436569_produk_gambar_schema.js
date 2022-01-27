"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProdukGambarSchema extends Schema {
  up() {
    this.create("produk_gambar", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("produk")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("produk");
      table.string("name", 100).notNullable();
    });
  }

  down() {
    this.drop("produk_gambar");
  }
}

module.exports = ProdukGambarSchema;
