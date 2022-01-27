"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PekerjaanMaterialSchema extends Schema {
  up() {
    this.create("pekerjaan_material", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("pekerjaan")
        .unsigned()
        .references("id")
        .inTable("pekerjaan");
      table.integer("karyawan").unsigned().references("id").inTable("karyawan");
      table.string("name", 100).notNullable();
      table.integer("qty").notNullable();
      table.string("satuan").default("unit");
      table.boolean("isRequest").default(false);
    });
  }

  down() {
    this.drop("pekerjaan_material");
  }
}

module.exports = PekerjaanMaterialSchema;
