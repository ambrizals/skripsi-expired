'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyProdukSchema extends Schema {
  up () {
    this.table('produk', (table) => {
      // alter table
      table.boolean('is_archive').default(false)
    })
  }

  down () {
    this.table('produk', (table) => {
      // reverse alternations
      table.dropColumn('is_archive')
    })
  }
}

module.exports = ModifyProdukSchema
