"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PelangganSchema extends Schema {
  up() {
    this.create("pelanggan", (table) => {
      table.increments();
      table.timestamps();
      table.string("name", 50).notNullable().unique();
      table.text("address").notNullable();
      table.string("phone", 13).nullable();
      table.boolean("isReseller").default(false);
    });
  }

  down() {
    this.drop("pelanggan");
  }
}

module.exports = PelangganSchema;
