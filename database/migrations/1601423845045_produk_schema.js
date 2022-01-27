"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProdukSchema extends Schema {
  up() {
    this.create("produk", (table) => {
      table.increments();
      table.timestamps();
      table.string("name", 100).notNullable().unique();
      table.integer("price").notNullable();
      table.string("cover", 255).nullable();
    });
  }

  down() {
    this.drop("produk");
  }
}

module.exports = ProdukSchema;
