'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyPekerjaanMaterialSchema extends Schema {
  up () {
    this.table('pekerjaan_material', (table) => {
      table.integer('requestBy').unsigned().references('id').inTable('karyawan')
      // alter table
    })
  }

  down () {
    this.table('pekerjaan_material', (table) => {
      table.dropColumn('requestBy');
      // reverse alternations
    })
  }
}

module.exports = ModifyPekerjaanMaterialSchema
