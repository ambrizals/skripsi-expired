"use strict";
const { test, trait, before } = use("Test/Suite")("Pekerjaan Material Test");

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
let pekerjaanMaterial;
let pekerjaanMaterialRequest;
let pekerjaanMaterialRequest2;

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

  const _pekerjaanMaterial = await Factory.model(
    "App/Models/Pekerjaan/Material"
  ).create({
    pekerjaan: pekerjaan.id,
    karyawan: karyawan.id,
    name: "Wood Filler Jati",
    qty: "1",
    satuan: "Liter",
  });

  pekerjaanMaterial = _pekerjaanMaterial.toJSON();

  const _pekerjaanMaterialRequest = await Factory.model(
    "App/Models/Pekerjaan/MaterialPermintaan"
  ).create({
    pekerjaan: pekerjaan.id,
    karyawan: karyawan.id,
    name: "Wood Filler Jati 2",
    qty: "1",
  });

  pekerjaanMaterialRequest = _pekerjaanMaterialRequest.toJSON();  

  const _pekerjaanMaterialRequest2 = await Factory.model(
    "App/Models/Pekerjaan/MaterialPermintaan"
  ).create({
    pekerjaan: pekerjaan.id,
    karyawan: karyawan.id,
    name: "Wood Filler Jati 2",
    qty: "1",
  });

  pekerjaanMaterialRequest2 = _pekerjaanMaterialRequest2.toJSON();
});

test("Make sure material list is accessible", async ({ client, assert }) => {
  const response = await client
    .get("api/pekerjaan/material/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  assert.isNotNull(result.payload.Karyawan);
  response.assertStatus(200);
});

test("Make sure outfield employee can't added", async ({ client, assert }) => {
  const response = await client
    .post("api/pekerjaan/material/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      supplier: "Profil Indah",
      name: "Hambalan",
      qty: 1,
      price: 5000,
      satuan: "unit",
    })
    .end();

  response.assertStatus(401);
});

test("Make sure material can added", async ({ client, assert }) => {
  const response = await client
    .post("api/pekerjaan/material/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", office.token)
    .send({
      supplier: "Profil Indah",
      name: "Hambalan",
      qty: 1,
      price: 5000,
      satuan: "unit",
    })
    .end();

  const result = JSON.parse(response.text);
  assert.equal(
    result.payload.message,
    "Material pekerjaan sudah ditambahkan !"
  );
  response.assertStatus(200);
});

test("When same material is create is suppose to update existed data", async ({
  client,
  assert,
}) => {
  const response = await client
    .post("api/pekerjaan/material/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", office.token)
    .send({
      supplier: "Profil Indah",
      name: "Hambalan",
      qty: 1,
      price: 3000,
      satuan: "unit",
    })
    .end();

  const result = JSON.parse(response.text);
  assert.equal(
    result.payload.message,
    "Material pekerjaan sudah ditambahkan !"
  );
  response.assertStatus(200);
});

test("Make sure requested material list is accessible", async ({ client, assert }) => {
  const response = await client.get(`api/pekerjaan/material/request/${pekerjaan.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();

  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
})

test("Make sure accepting material request is proceed", async ({ client }) => {
  const response = await client.put(`api/pekerjaan/material/accept/${pekerjaanMaterialRequest.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .send({
      supplier: "Surya Santosa",
      name: "Wood Filler Jati 2",
      qty: "1",
      satuan: "unit",
      price: 200000
    })
    .end();
  response.assertStatus(200);
})

test("Make sure requested material can be deleted", async ({ client }) => {
  const response = await client.delete(`api/pekerjaan/material/${pekerjaanMaterialRequest2.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();

  response.assertStatus(200);
})