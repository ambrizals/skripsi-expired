'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyPekerjaanMaterialPengeluaranSchema extends Schema {
  up () {
    this.table('pekerjaan_material_pengeluaran', (table) => {
      table.integer('permintaan').unsigned().references('id').inTable('pekerjaan_permintaan_material');
      // alter table
    })
  }

  down () {
    this.table('pekerjaan_material_pengeluaran', (table) => {
      table.dropColumn('permintaan');
      // reverse alternations
    })
  }
}

module.exports = ModifyPekerjaanMaterialPengeluaranSchema
