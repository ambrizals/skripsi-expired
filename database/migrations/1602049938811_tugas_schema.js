"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TugasSchema extends Schema {
  up() {
    this.create("tugas", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("pekerjaan")
        .unsigned()
        .references("id")
        .inTable("pekerjaan");
      table
        .integer("penerima")
        .unsigned()
        .references("id")
        .inTable("karyawan_jabatan");
      table.string("name", 100).notNullable();
      table.integer("target_selesai").default(0);
      table.integer("jumlah_selesai").default(0);
      table.boolean("isFinish").default(false);
    });
  }

  down() {
    this.drop("tugas");
  }
}

module.exports = TugasSchema;
