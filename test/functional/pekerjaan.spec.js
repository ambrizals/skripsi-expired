"use strict";
const { test, trait, before } = use("Test/Suite")("Pekerjaan Test");

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
    status: 'waiting_confirmation',
  });
  transaksi = _transaksi.toJSON();

  const _detail = await Factory.model("App/Models/Transaksi/Detail").create({
    transaksi: transaksi.id,
    jenis: 2,
    price: 100000,
    name: 'Kursi Rattan Tanganan Oval'
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
    created_by: office.user.id
  });

  pekerjaan = _pekerjaan.toJSON();
});

test("Make sure pekerjaan is accessible", async ({ assert, client }) => {
  const response = await client
    .get("api/pekerjaan")
    .header("X-AUTH-TOKEN", office.token)
    .end();

  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
});

test("Make sure pekerjaan pagination is accessible", async ({ assert, client }) => {
  const response = await client
    .get("api/pekerjaan?paginate=1")
    .header("X-AUTH-TOKEN", office.token)
    .end();

  const result = JSON.parse(response.text);
  assert.equal(result.payload.length, 0);
  response.assertStatus(200);
});

test("Make sure pekerjaan search by id is accessible", async ({ assert, client }) => {
  const response = await client
    .get(`api/pekerjaan?searchId=${pekerjaan.id}`)
    .header("X-AUTH-TOKEN", office.token)
    .end();

  const result = JSON.parse(response.text);
  assert.equal(result.payload.length, 1);
  response.assertStatus(200);
});

test("Make sure pekerjaan search by id is accessible", async ({ assert, client }) => {
  const response = await client
    .get(`api/pekerjaan?searchName=${pekerjaan.name}`)
    .header("X-AUTH-TOKEN", office.token)
    .end();

  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
});

test("Make sure pekerjaan isn't accessible by outfield employee", async ({
  client,
}) => {
  const response = await client
    .get("api/pekerjaan")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(401);
});

test("Make sure outfield employee can't create pekerjaan", async ({
  client,
}) => {
  const response = await client
    .post("api/pekerjaan/" + transaksi.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(401);
});

test("Create a new Pekerjaan Data", async ({ client, assert }) => {
  const response = await client
    .post("api/pekerjaan/" + transaksi.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  const result = JSON.parse(response.text);
  assert.equal(result.payload.message, "Pekerjaan telah dibuat");
  response.assertStatus(200);
});

test("Can't process transaction with process status or more higher", async ({
  client,
  assert,
}) => {
  const response = await client
    .post("api/pekerjaan/" + transaksi.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  const result = JSON.parse(response.text);
  assert.equal(
    result.payload.message,
    "E_PEKERJAAN_CONFLICT: Transaksi yang anda pilih sudah di proses atau belum melakukan pembayaran"
  );
  response.assertStatus(409);
});

test("Make sure pekerjaan detail is accessible", async ({ client, assert }) => {
  const response = await client
    .get("api/pekerjaan/" + pekerjaan.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();

  const result = JSON.parse(response.text);
  assert.exists(result.payload);
  assert.exists(result.payload.DetailTransaksi);
  assert.isNotNull(result.payload.DetailTransaksi);
  assert.isNotNull(result.payload.CreatedBy);
  response.assertStatus(200);
});

test("make sure pekerjaan note is updatable", async ({ client }) => {
  const response = await client.put(`api/pekerjaan/${pekerjaan.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .send({
      catatan: 'sudah update yo !'
    })
    .end()
  
  response.assertStatus(200);
})