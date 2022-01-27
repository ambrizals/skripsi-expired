'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTugasKaryawanSchema extends Schema {
  up () {
    this.table('tugas_karyawan', (table) => {
      table.integer('revokeBy').unsigned().references('id').inTable('karyawan');
    })
  }

  down () {
    this.table('tugas_karyawan', (table) => {
      table.dropColumn('revokeBy');
    })
  }
}

module.exports = ModifyTugasKaryawanSchema
