"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Supplier extends Model {
  static get table() {
    return "supplier";
  }

  material() {
    return this.hasMany("App/Models/Material/Material", "id", "supplier");
  }
}

module.exports = Supplier;
