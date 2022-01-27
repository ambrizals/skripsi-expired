"use strict";
const { test, trait, before } = use("Test/Suite")(
  "Pekerjaan Tugas Material Test"
);

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
let tugas;
let tugasHistory;

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
    status: "on_process",
  });
  transaksi = _transaksi.toJSON();

  const _detail = await Factory.model("App/Models/Transaksi/Detail").create({
    transaksi: transaksi.id,
    jenis: 2,
    price: 100000,
    qty: 5
  });
  detail = _detail.toJSON();

  const _pembayaran = await Factory.model(
    "App/Models/Transaksi/Pembayaran"
  ).create({
    transaksi: transaksi.id,
    jumlah_pembayaran: 500000,
  });

  pembayaran = _pembayaran.toJSON();

  const _pekerjaan = await Factory.model("App/Models/Pekerjaan").create({
    transaksi_detail: detail.id,
    name: "Servis Kursi",
    catatan: "Rotan Dudukan Patah",
    created_by: office.user.id,

  });

  pekerjaan = _pekerjaan.toJSON();

  const _pekerjaanMaterial = await Factory.model(
    "App/Models/Pekerjaan/Material"
  ).create({
    pekerjaan: pekerjaan.id,
    karyawan: karyawan.id,
    name: "Wood Filler Jati",
    qty: 1,
    satuan: "Liter",
  });

  pekerjaanMaterial = _pekerjaanMaterial.toJSON();

  const _tugas = await Factory.model("App/Models/Tugas").create({
    pekerjaan: pekerjaan.id,
    penerima: 3,
    name: "Buat Rangka",
    target_selesai: detail.qty,
  });
  tugas = _tugas.toJSON();

  const _tugasHistory = await Factory.model("App/Models/Tugas/Karyawan").create({
    tugas: tugas.id,
    karyawan: karyawan.id,
    created_by: office.user.id,
    pekerjaan: pekerjaan.id,
    jumlah_selesai: 1,    
  })

  tugasHistory = _tugasHistory.toJSON();

  await Factory.model("App/Models/Tugas/Karyawan").create({
    tugas: tugas.id,
    karyawan: karyawan.id,
    created_by: office.user.id,
    pekerjaan: pekerjaan.id,
    jumlah_selesai: 1,
  })  

});

test("Make sure tugas list is accessible", async ({ client, assert }) => {
  const response = await client
    .get("api/pekerjaan/tugas/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
  assert.isNotNull(result.payload.CreatedBy)
  assert.isNotNull(result.payload.Penerima)
});

test("Make sure tugas history is accessible", async ({ client, assert }) => {
  const response = await client
    .get("api/pekerjaan/tugas/detail/" + tugas.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
});

test("Make sure outfield employee can't create tugas", async ({ client }) => {
  const response = await client
    .post("api/pekerjaan/tugas/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      name: "Buat Rangka",
    })
    .end();

  response.assertStatus(401);
});

test("Make sure office employee can create tugas", async ({ client }) => {
  const response = await client
    .post("api/pekerjaan/tugas/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", office.token)
    .send({
      name: "Buat Rangka",
      penerima: 8,
      catatan: 'Harus bagus yak'
    })
    .end();
  response.assertStatus(200);
});

test("Make sure tugas history is accessible", async ({ client, assert }) => {
  const response = await client.get(`api/pekerjaan/tugas/history/${pekerjaan.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();

  response.assertStatus(200);
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  assert.isNotNull(result.payload[0].Karyawan);
  assert.isNotNull(result.payload[0].CreatedBy);
  assert.isNotNull(result.payload[0].Tugas);
  assert.isNull(result.payload[0].RevokeBy);
})

test("Make sure outfield employee can't destroy tugas", async ({ client, assert }) => {
  const response = await client
    .delete("api/pekerjaan/tugas/" + tugas.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(401);
});

test("Make sure tugas history can be canceled", async ({ client, assert }) => {
  const response = await client.delete(`api/pekerjaan/tugas/revoke/${tugasHistory.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();
    
  response.assertStatus(200);

  const response_history = await client.get(`api/pekerjaan/tugas/history/${pekerjaan.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();

  response_history.assertStatus(200);
  const result_history = JSON.parse(response_history.text);
  assert.isAbove(result_history.payload.length, 0);
  assert.isNotNull(result_history.payload[0].Karyawan);
  assert.isNotNull(result_history.payload[0].CreatedBy);
  assert.isNotNull(result_history.payload[0].Tugas);
  assert.isNotNull(result_history.payload[0].RevokeBy);  
})

test("Make sure office employee can destroy tugas", async ({ client }) => {
  const response = await client
    .delete("api/pekerjaan/tugas/" + tugas.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  response.assertStatus(200);
});
