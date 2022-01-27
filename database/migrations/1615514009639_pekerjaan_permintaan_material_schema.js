'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PekerjaanPermintaanMaterialSchema extends Schema {
  up () {
    this.create('pekerjaan_permintaan_material', (table) => {
      table.increments();
      table.timestamps();
      table
        .integer("pekerjaan")
        .unsigned()
        .references("id")
        .inTable("pekerjaan");
      table.integer("karyawan").unsigned().references("id").inTable("karyawan");
      table.integer("executioner").unsigned().references("id").inTable("karyawan");
      table.string('name');
      table.integer('qty');
      table.boolean('isAccept').nullable();
    })
  }

  down () {
    this.drop('pekerjaan_permintaan_material')
  }
}

module.exports = PekerjaanPermintaanMaterialSchema
