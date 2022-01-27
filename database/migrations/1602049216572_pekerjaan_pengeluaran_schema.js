"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PekerjaanPengeluaranSchema extends Schema {
  up() {
    this.create("pekerjaan_pengeluaran", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("pekerjaan")
        .unsigned()
        .references("id")
        .inTable("pekerjaan");
      table.integer("karyawan").unsigned().references("id").inTable("karyawan");
      table.string("name", 100).notNullable();
      table.integer("biaya").notNullable();
      table.boolean("isMaterial").default(false);
    });
  }

  down() {
    this.drop("pekerjaan_pengeluaran");
  }
}

module.exports = PekerjaanPengeluaranSchema;
