"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TransaksiDetailImageSchema extends Schema {
  up() {
    this.create("transaksi_detail_gambar", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("transaksi_detail")
        .unsigned()
        .references("id")
        .inTable("transaksi_detail")
        .onDelete("cascade")
        .onUpdate("cascade");
      table.string("name", 150).notNullable();
      table.boolean("isAssets").default(false);
    });
  }

  down() {
    this.drop("transaksi_detail_gambar");
  }
}

module.exports = TransaksiDetailImageSchema;
