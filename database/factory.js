"use strict";

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

// Register Factory

require("./factories/Karyawan");
require("./factories/Karyawan_Jabatan");
require("./factories/Produk");
require("./factories/ProdukSpesifikasi");
require("./factories/ProdukGambar");
require("./factories/MaterialSupplier");
require("./factories/Material");
require("./factories/Pelanggan");
require("./factories/Transaksi");
require("./factories/TransaksiDetail");
require("./factories/TransaksiDetailProduct");
require("./factories/TransaksiDetailCustom");
require("./factories/TransaksiDetailSpesifikasi");
require("./factories/TransaksiDetailGambar");
require("./factories/TransaksiPembayaran");
require("./factories/Pekerjaan");
require("./factories/PekerjaanPengeluaran");
require("./factories/PekerjaanMaterial");
require("./factories/PekerjaanMaterialPengeluaran");
require("./factories/PekerjaanMaterialPermintaan");
require("./factories/Tugas");
require("./factories/TugasKaryawan");
require("./factories/Pengiriman");
