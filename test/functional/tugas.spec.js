"use strict";
const { test, trait, before } = use("Test/Suite")("Tugas Test");

const Helpers = use("Helpers");

const Factory = use("Factory");

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");

let office;
let outfield;
let customAuth;

let karyawan;
let pelanggan;
let transaksi;
let detail;
let pembayaran;
let pekerjaan;
let pekerjaanMaterial;
let tugas;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();

  // Prepare Foreign Data
  const _karyawan = await Factory.model("App/Models/Karyawan/Karyawan").create({
    role: 5,
  });
  karyawan = _karyawan.toJSON();

  customAuth = await auth.custom(karyawan.username);

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
    qty: 5,
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
    qty: 1,
    satuan: "Liter",
  });

  pekerjaanMaterial = _pekerjaanMaterial.toJSON();

  const _tugas = await Factory.model("App/Models/Tugas").create({
    pekerjaan: pekerjaan.id,
    penerima: 5,
    name: "Buat Rangka",
    target_selesai: detail.qty,
    jumlah_selesai: 2,
  });

  tugas = _tugas.toJSON();

  await Factory.model("App/Models/Tugas/Karyawan").create({
    tugas: tugas.id,
    karyawan: karyawan.id,
    jumlah_selesai: 2,
  });
});

test("Make sure tugas list is accessible", async ({ client, assert }) => {
  const response = await client
    .get("api/tugas")
    .header("X-AUTH-TOKEN", customAuth.token)
    .end();

  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
});

test("Make sure tugas detail is accessible", async ({ client, assert }) => {
  const response = await client
    .get("api/tugas/detail/" + tugas.id)
    .header("X-AUTH-TOKEN", customAuth.token)
    .end();
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
});

test("Restrict create tugas checkpoint when qty greather than target_selesai", async ({
  client,
}) => {
  const response = await client
    .post("api/tugas/" + tugas.id)
    .header("X-AUTH-TOKEN", customAuth.token)
    .send({
      qty: 10,
    })
    .end();
  response.assertStatus(423);
});

test("Create material request", async ({ client }) => {
  const response = await client.post('api/tugas/request/' + tugas.id)
    .header('X-AUTH-TOKEN', customAuth.token)
    .send({
      name: "Impra Clear Doff",
      qty: 1
    })
    .end();
  response.assertStatus(200);
})

test("Create tugas checkpoint", async ({ client }) => {
  const response = await client
    .post("api/tugas/" + tugas.id)
    .header("X-AUTH-TOKEN", customAuth.token)
    .send({
      qty: 3,
    })
    .end();
  response.assertStatus(200);
});


test("Finish Pekerjaan Status", async ({ client, assert }) => {
  const response = await client
    .put("api/pekerjaan/finish/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  const result = JSON.parse(response.text);
  assert.equal(
    result.payload.message,
    "Pekerjaan telah diselesaikan."
  );
  response.assertStatus(200);
});
