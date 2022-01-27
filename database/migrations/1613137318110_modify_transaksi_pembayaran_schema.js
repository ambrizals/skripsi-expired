'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTransaksiPembayaranSchema extends Schema {
  up () {
    this.table('transaksi_pembayaran', (table) => {
      table.boolean('is_refund').default(false);
      // alter table
    })
  }

  down () {
    this.table('transaksi_pembayaran', (table) => {
      table.dropColumn('is_refund');
    })
  }
}

module.exports = ModifyTransaksiPembayaranSchema
