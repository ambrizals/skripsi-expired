"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TransaksiDetailCustomSchema extends Schema {
  up() {
    this.create("transaksi_detail_custom", (table) => {
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
    });
  }

  down() {
    this.drop("transaksi_detail_custom");
  }
}

module.exports = TransaksiDetailCustomSchema;
