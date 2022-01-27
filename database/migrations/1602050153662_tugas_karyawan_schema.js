"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TugasKaryawanSchema extends Schema {
  up() {
    this.create("tugas_karyawan", (table) => {
      table.increments();
      table.timestamps();
      table.integer("tugas").unsigned().references("id").inTable("tugas");
      table.integer("karyawan").unsigned().references("id").inTable("karyawan");
      table.integer("jumlah_selesai").default(0);
    });
  }

  down() {
    this.drop("tugas_karyawan");
  }
}

module.exports = TugasKaryawanSchema;
