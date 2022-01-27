'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTugasKaryawanSchema extends Schema {
  up () {
    this.table('tugas_karyawan', (table) => {
      table.boolean('isCancel').default(false);
      table.string('catatan').nullable();
      table.integer('created_by').unsigned().references('id').inTable('karyawan');
    })
  }

  down () {
    this.table('tugas_karyawan', (table) => {
      table.dropColumn('isCancel');
      table.dropColumn('catatan');
      table.dropColumn('created_by');
    })
  }
}

module.exports = ModifyTugasKaryawanSchema
