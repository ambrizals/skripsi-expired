'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTransactionDetailSchema extends Schema {
  up () {
    this.table('transaksi_detail', (table) => {
      table.string('name', 150);
    })
  }

  down () {
    this.table('transaksi_detail', (table) => {
      table.dropColumn('name');
    })
  }
}

module.exports = ModifyTransactionDetailSchema
