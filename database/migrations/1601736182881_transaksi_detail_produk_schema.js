"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TransaksiDetailProdukSchema extends Schema {
  up() {
    this.create("transaksi_detail_produk", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("transaksi_detail")
        .unsigned()
        .references("id")
        .inTable("transaksi_detail")
        .onDelete("cascade")
        .onUpdate("cascade");
      table.integer("produk").unsigned().references("id").inTable("produk");
    });
  }

  down() {
    this.drop("transaksi_detail_produk");
  }
}

module.exports = TransaksiDetailProdukSchema;
