'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTransaksiSchema extends Schema {
  /**
   * Status transaksi
   * 
   * 0 = revoke
   * 1 = quotation
   * 2 = waiting_confirmation
   * 3 = on_process
   * 4 = waiting_shipping
   * 5 = on_shipping
   * 6 = received
   * 
   */
  up () {
    this.table('transaksi', (table) => {
      if (process.env.NODE_ENV !== 'testing') {
        table.string('status').notNullable().default('quotation').alter()
      } else {
        table.string('status').notNullable().default('quotation');
      }
    })
  }

  down () {
    this.table('transaksi', (table) => {
      if (process.env.NODE_ENV !== 'testing') {
        table.integer("status").notNullable().default(1).alter();
      } else {
        table.dropColumn('status')
      }
    })
  }
}

module.exports = ModifyTransaksiSchema
