"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TransaksiPembayaranSchema extends Schema {
  up() {
    this.create("transaksi_pembayaran", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("transaksi")
        .unsigned()
        .references("id")
        .inTable("transaksi");
      table.integer("jumlah_pembayaran").notNullable();
    });
  }

  down() {
    this.drop("transaksi_pembayaran");
  }
}

module.exports = TransaksiPembayaranSchema;
