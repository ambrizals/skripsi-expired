"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PekerjaanSchema extends Schema {
  up() {
    this.create("pekerjaan", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("transaksi_detail")
        .unsigned()
        .references("id")
        .inTable("transaksi_detail");
      table.string("name", 100).notNullable();
      table.text("catatan").nullable();
      table.boolean("isReady").default(false);
    });
  }

  down() {
    this.drop("pekerjaan");
  }
}

module.exports = PekerjaanSchema;
