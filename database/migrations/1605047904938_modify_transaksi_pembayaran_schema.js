'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTransaksiPembayaranSchema extends Schema {
  up () {
    this.table('transaksi_pembayaran', (table) => {
      table.integer('id_karyawan').unsigned().references('id').inTable('karyawan');
    })
  }

  down () {
    this.table('transaksi_pembayaran', (table) => {
      table.dropColumn('id_karyawan');
    })
  }
}

module.exports = ModifyTransaksiPembayaranSchema
