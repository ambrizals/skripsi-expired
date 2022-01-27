'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyPekerjaanMaterialSchema extends Schema {
  up () {
    this.table('pekerjaan_material', (table) => {
      if (process.env.NODE_ENV !== 'testing') {
        table.boolean('isRequest').notNullable().default(false).alter()
      } else {
        table.dropColumn('requestBy');
      }
    })
  }

  down () {
    this.table('pekerjaan_material', (table) => {
      if (process.env.NODE_ENV !== 'testing') {
        table.boolean('isRequest').notNullable().default(true).alter()
      } else {
        table.integer('requestBy').unsigned().references('id').inTable('karyawan')
      }
    })
  }
}

module.exports = ModifyPekerjaanMaterialSchema
