"use strict";

/*
|--------------------------------------------------------------------------
| InsertMaterialSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Material = use("App/Models/Material/Material");
const Supplier = use("App/Models/Material/Supplier");

class InsertMaterialSeeder {
  async run() {
    const supplier = {
      name: "Profil Indah",
      type: "Toko Perlengkapan HPL",
      address: "Jl. Buluh Indah No.54C, Pemecutan Kaja",
      phone: "085100944999",
    };

    const _supplierData = await Supplier.create(supplier);
    const supplierData = _supplierData.toJSON();

    const material = {
      supplier: supplierData.id,
      name: "Ambalan L Tipis",
      price: 500,
      satuan: "unit",
    };

    await Material.create(material);
  }
}

module.exports = InsertMaterialSeeder;
