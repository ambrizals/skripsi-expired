"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Material extends Model {
  static get table() {
    return "material";
  }

  Supplier() {
    return this.belongsTo("App/Models/Material/Supplier", "supplier", "id");
  }
}

module.exports = Material;
