"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TransaksiDetailSchema extends Schema {
  up () {
    this.create("transaksi_detail", (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("transaksi")
        .unsigned()
        .references("id")
        .inTable("transaksi");
      table.integer("jenis").default(0); // 0 = Produk, 1 = Custom, 2 = Service
      table.integer("qty").notNullable();
      table.integer("price").notNullable();
      table.text("deskripsi").nullable();
      /**
       * Status Note
       * 0 = Unsigned, 1 = Pending, 2 = On Process, 3 = Finish
       */
      if (process.env.NODE_ENV !== 'testing') {
        table.integer("status").default(0);
      }
      table.string("cover").nullable();
    });
  }

  down () {
    this.drop("transaksi_detail");
  }
}

module.exports = TransaksiDetailSchema;
