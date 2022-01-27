"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PengirimanSchema extends Schema {
  up() {
    this.create("pengiriman", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("transaksi")
        .unsigned()
        .references("id")
        .inTable("transaksi");
      table.integer("pengirim").unsigned().references("id").inTable("karyawan");
      table.string("penerima", 100).nullable();
      /**
       *
       * Status : 0 = Unreceive, 1 = Receive
       *
       */
      table.integer("status").default(0);
    });
  }

  down() {
    this.drop("pengiriman");
  }
}

module.exports = PengirimanSchema;
