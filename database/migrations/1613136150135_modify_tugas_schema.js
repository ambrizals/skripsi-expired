'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTugasSchema extends Schema {
  up () {
    this.table('tugas', (table) => {
      table.integer('created_by').unsigned().references('id').inTable('karyawan');      
    })
  }

  down () {
    this.table('tugas', (table) => {
      table.dropColumn('created_by');
    })
  }
}

module.exports = ModifyTugasSchema
