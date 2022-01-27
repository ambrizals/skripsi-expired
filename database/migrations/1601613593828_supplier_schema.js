"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SupplierSchema extends Schema {
  up() {
    this.create("supplier", (table) => {
      table.increments();
      table.timestamps();
      table.string("name", 150).notNullable().unique();
      table.string("type", 50).nullable();
      table.text("address").nullable();
      table.string("phone", 13).nullable();
      table.boolean("is_valid").default(false);
    });
  }

  down() {
    this.drop("supplier");
  }
}

module.exports = SupplierSchema;
