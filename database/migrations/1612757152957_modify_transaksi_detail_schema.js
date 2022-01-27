'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTransaksiDetailSchema extends Schema {
  /**
   * Status detail transaksi :
   * 
   * unsigned
   * pending
   * process
   * finish
   * 
   */
  up () {
    this.table('transaksi_detail', (table) => {
      if (process.env.NODE_ENV !== 'testing') {
        table.string("status").default('unsigned').alter();
      } else {
        table.string("status").default('unsigned')
      }
      // alter table
    })
  }

  down () {
    this.table('transaksi_detail', (table) => {
      if (process.env.NODE_ENV !== 'testing') {
        table.string("status").default(0).alter()
      } else {
        table.dropColumn('status')
      }
    })
  }
}

module.exports = ModifyTransaksiDetailSchema
