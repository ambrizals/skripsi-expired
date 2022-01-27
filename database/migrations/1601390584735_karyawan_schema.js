"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class KaryawanSchema extends Schema {
  up() {
    this.create("karyawan", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("role")
        .default(1)
        .unsigned()
        .references("id")
        .inTable("karyawan_jabatan"); // 1 = Unsigned, 2 = is owner, 3 = is office worker, 4 > outfield worker
      table.string("username", 50).notNullable().unique();
      table.string("password", 255).notNullable();
      table.string("fullname", 100).notNullable();
      table.text("home_address").nullable();
      table.string("phone_number", 13).nullable();
      table.boolean("is_active").default(false);
    });
  }

  down() {
    this.drop("karyawan");
  }
}

module.exports = KaryawanSchema;
