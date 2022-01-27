'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTugasSchema extends Schema {
  up () {
    this.table('tugas', (table) => {
      table.string('catatan')
      // alter table
    })
  }

  down () {
    this.table('tugas', (table) => {
      table.dropColumn('catatan');
      // reverse alternations
    })
  }
}

module.exports = ModifyTugasSchema
