'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTugasKaryawanSchema extends Schema {
  up () {
    this.table('tugas_karyawan', (table) => {
      table.integer('pekerjaan').unsigned().references('id').inTable('pekerjaan');
    })
  }

  down () {
    this.table('tugas_karyawan', (table) => {
      table.dropColumn('pekerjaan');
    })
  }
}

module.exports = ModifyTugasKaryawanSchema
