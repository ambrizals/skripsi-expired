'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyPekerjaanSchema extends Schema {
  up () {
    this.table('pekerjaan', (table) => {
      table.integer('created_by').unsigned().references('id').inTable('karyawan');
    })
  }

  down () {
    this.table('pekerjaan', (table) => {
      table.dropColumn('created_by');
    })
  }
}

module.exports = ModifyPekerjaanSchema
