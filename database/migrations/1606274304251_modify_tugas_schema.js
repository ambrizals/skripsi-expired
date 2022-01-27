'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTugasSchema extends Schema {
  up () {
    this.table('tugas', (table) => {
      table.integer('transaksi_detail').unsigned().references('id').inTable('transaksi_detail');
    })
  }

  down () {
    this.table('tugas', (table) => {
      table.dropColumn('transaksi_detail');
    })
  }
}

module.exports = ModifyTugasSchema
