"use strict";

/*
|--------------------------------------------------------------------------
| ProductSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const Produk = use("App/Models/Produk/Produk");
const Specs = use("App/Models/Produk/Spesifikasi");

class ProductSeeder {
  async run() {

    const _data = await Produk.create({
      name: "Kursi Makan Rattan",
      price: 450000,
    });

    const data = _data.toJSON();

    const specs = [
      {
        produk: data.id,
        name: "Bahan Konstruksi",
        value: "Besi Batang",
      },
      {
        produk: data.id,
        name: "Warna",
        value: "Natural",
      },
    ];

    await Specs.createMany(specs);
  }
}

module.exports = ProductSeeder;
