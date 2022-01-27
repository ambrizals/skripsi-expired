"use strict";
const { test, trait, before } = use("Test/Suite")("Pekerjaan Pengeluaran Test");

const Helpers = use("Helpers");

const Factory = use("Factory");

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");

let office;
let outfield;

let karyawan;
let pelanggan;
let transaksi;
let detail;
let pembayaran;
let pekerjaan;
let pekerjaanPengeluaran;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();

  // Prepare Foreign Data
  const _karyawan = await Factory.model("App/Models/Karyawan/Karyawan").create({
    role: 3,
  });
  karyawan = _karyawan.toJSON();
  const _pelanggan = await Factory.model("App/Models/Pelanggan").create();
  pelanggan = _pelanggan.toJSON();

  // Prepare main data
  const _transaksi = await Factory.model(
    "App/Models/Transaksi/Transaksi"
  ).create({
    karyawan: pelanggan.id,
    pelanggan: karyawan.id,
    total_transaksi: 100000,
    jumlah_pembayaran: 100000,
    status: 2,
  });
  transaksi = _transaksi.toJSON();

  const _detail = await Factory.model("App/Models/Transaksi/Detail").create({
    transaksi: transaksi.id,
    jenis: 2,
    price: 100000,
  });
  detail = _detail.toJSON();

  const _pembayaran = await Factory.model(
    "App/Models/Transaksi/Pembayaran"
  ).create({
    transaksi: transaksi.id,
    jumlah_pembayaran: 100000,
  });

  pembayaran = _pembayaran.toJSON();

  const _pekerjaan = await Factory.model("App/Models/Pekerjaan").create({
    transaksi_detail: detail.id,
    name: "Servis Kursi",
    catatan: "Rotan Dudukan Patah",
  });

  pekerjaan = _pekerjaan.toJSON();

  const _pekerjaanPengeluaran = await Factory.model(
    "App/Models/Pekerjaan/Pengeluaran"
  ).create({
    pekerjaan: pekerjaan.id,
    karyawan: karyawan.id,
    name: "Finishing Diluar",
    biaya: 10000,
  });

  pekerjaanPengeluaran = _pekerjaanPengeluaran.toJSON();
});

test("Make sure pengeluaran list is accessible ", async ({
  client,
  assert,
}) => {
  const response = await client
    .get("api/pekerjaan/pengeluaran/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();

  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
});

test("Create new pengeluaran", async ({ client, assert }) => {
  const response = await client
    .post("api/pekerjaan/pengeluaran/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", office.token)
    .send({
      name: "Potong Kaca",
      biaya: 50000,
    })
    .end();

  const result = JSON.parse(response.text);
  response.assertStatus(200);
  assert.equal(result.payload.message, "Data Pengeluaran Telah Ditambah !");
});

test("Delete Pengeluaran Material", async ({ client, assert }) => {
  const _fakeSupplier = await Factory.model("App/Models/Material/Supplier").create();
  const fakeSupplier = _fakeSupplier.toJSON();

  const _fakeData = await Factory.model(
    "App/Models/Material/Material"
  ).create({
    supplier: fakeSupplier.id
  });
  const fakeData = _fakeData.toJSON();

  const _pekerjaanMaterial = await Factory.model(
    "App/Models/Pekerjaan/Material"
  ).create({
    pekerjaan: pekerjaan.id,
    karyawan: karyawan.id,
    name: fakeData.name,
    qty: 1,
    satuan: "Liter",
  });

  const pekerjaanMaterial = _pekerjaanMaterial.toJSON();

  const _pengeluaran1 = await Factory.model(
    "App/Models/Pekerjaan/Pengeluaran"
  ).create({
    pekerjaan: pekerjaan.id,
    karyawan: karyawan.id,
    name: "Pembelian Material Wood Fillter Jati : " + pekerjaanMaterial.name,
    biaya: 10000,
    isMaterial: true,
  });

  const pengeluaran1 = _pengeluaran1.toJSON();

  const _hub = await Factory.model(
    "App/Models/Pekerjaan/MaterialPengeluaran"
  ).create({
    material: fakeData.id,
    pekerjaan_material: pekerjaanMaterial.id,
    pekerjaan_pengeluaran: pengeluaran1.id,
    qty: 1,
    price: fakeData.name,
  });

  const response = await client
    .delete("api/pekerjaan/pengeluaran/" + pengeluaran1.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  const result = JSON.parse(response.text);
  response.assertStatus(200);
  assert.equal(result.payload.message, "Pengeluaran berhasil di hapus !");
});

test("Delete Pekerjaan Pengeluaran", async ({ client, assert }) => {
  const response = await client
    .delete("api/pekerjaan/pengeluaran/" + pekerjaanPengeluaran.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  const result = JSON.parse(response.text);
  response.assertStatus(200);
  assert.equal(result.payload.message, "Pengeluaran berhasil di hapus !");
});
