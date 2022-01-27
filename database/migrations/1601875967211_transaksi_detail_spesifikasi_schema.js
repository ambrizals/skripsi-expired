"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TransaksiDetailSpesifikasiSchema extends Schema {
  up() {
    this.create("transaksi_detail_spesifikasi", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("transaksi_detail")
        .unsigned()
        .references("id")
        .inTable("transaksi_detail")
        .onDelete("cascade")
        .onUpdate("cascade");
      table.string("name", 100).notNullable();
      table.string("value", 255).notNullable();
    });
  }

  down() {
    this.drop("transaksi_detail_spesifikasi");
  }
}

module.exports = TransaksiDetailSpesifikasiSchema;
