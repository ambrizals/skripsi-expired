"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProdukSpesifikasiSchema extends Schema {
  up() {
    this.create("produk_spesifikasi", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("produk")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("produk");
      table.string("name", 50).notNullable();
      table.string("value", 150).notNullable();
    });
  }

  down() {
    this.drop("produk_spesifikasi");
  }
}

module.exports = ProdukSpesifikasiSchema;
