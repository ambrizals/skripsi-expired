'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyTugasSchema extends Schema {
  up () {
    this.table('tugas', (table) => {
      table.boolean('isDelete').default(false);
      // alter table
    })
  }

  down () {
    this.table('tugas', (table) => {
      table.dropColumn('isDelete');
      // reverse alternations
    })
  }
}

module.exports = ModifyTugasSchema
