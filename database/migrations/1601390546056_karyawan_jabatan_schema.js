"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class KaryawanJabatanSchema extends Schema {
  up() {
    this.create("karyawan_jabatan", (table) => {
      table.increments();
      table.timestamps();
      table.string("name", 30).notNullable().unique();
      table.boolean("isOffice").notNullable().default(false);
      table.boolean("isOwner").notNullable().default(0);
    });
  }

  down() {
    this.drop("karyawan_jabatan");
  }
}

module.exports = KaryawanJabatanSchema;
