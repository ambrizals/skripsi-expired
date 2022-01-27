"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MaterialSchema extends Schema {
  up() {
    this.create("material", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("supplier")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("supplier");
      table.string("name", 100).notNullable();
      table.integer("price").notNullable();
      table.string("satuan").default("unit");
    });
  }

  down() {
    this.drop("material");
  }
}

module.exports = MaterialSchema;
