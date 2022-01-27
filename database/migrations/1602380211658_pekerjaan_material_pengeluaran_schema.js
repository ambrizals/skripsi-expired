"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PekerjaanMaterialPengeluaranSchema extends Schema {
  up() {
    this.create("pekerjaan_material_pengeluaran", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("pekerjaan_material")
        .unsigned()
        .references("id")
        .inTable("pekerjaan_material");
      table
        .integer("pekerjaan_pengeluaran")
        .unsigned()
        .references("id")
        .inTable("pekerjaan_pengeluaran");
      table.integer("material").unsigned().references("id").inTable("material");
      table.integer("qty").notNullable();
      table.integer("price").notNullable();
    });
  }

  down() {
    this.drop("pekerjaan_material_pengeluaran");
  }
}

module.exports = PekerjaanMaterialPengeluaranSchema;
