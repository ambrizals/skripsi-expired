'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyPekerjaanSchema extends Schema {
  up () {
    this.table('pekerjaan', (table) => {
      table.boolean('productCreated').default(false);
    })
  }

  down () {
    this.table('pekerjaan', (table) => {
      table.dropColumn('productCreated');
    })
  }
}

module.exports = ModifyPekerjaanSchema
