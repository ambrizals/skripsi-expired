'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTransaksiSchema extends Schema {
  up () {
    this.table('transaksi', (table) => {
      table.boolean('is_archive').default(false)
    })
  }

  down () {
    this.table('transaksi', (table) => {
      table.dropColumn('is_archive')
    })
  }
}

module.exports = ModifyTransaksiSchema
