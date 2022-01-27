"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TransaksiSchema extends Schema {
  up () {
    this.create("transaksi", (table) => {
      table.increments();
      table.timestamps();
      table.string("no_transaksi", 30).notNullable();
      table.integer("karyawan").unsigned().references("id").inTable("karyawan");
      table
        .integer("pelanggan")
        .unsigned()
        .references("id")
        .inTable("pelanggan");
      table.string("penerima", 100).notNullable();
      table.text("alamat_pengiriman").notNullable();
      table.integer("total_transaksi").default(0).notNullable();
      table.integer("jumlah_pembayaran").default(0).notNullable();
      table.string("nomor_telepon", 13).notNullable();
      /**  Status Table Note
       * 0 = Revoke, 1 = Penawaran, 2 = Menunggu Konfirmasi, 3 = Dalam Proses
       * 4 = Menunggu Pengiriman, 5 = Dalam Pengiriman, 6 = Terkirim
       * */
      if (process.env.NODE_ENV !== 'testing') {
        table.integer("status").notNullable().default(1);
      }

    });
  }

  down () {
    this.drop("transaksi");
  }
}

module.exports = TransaksiSchema;
