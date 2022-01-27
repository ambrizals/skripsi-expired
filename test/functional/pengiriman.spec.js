"use strict";
const { test, trait, before } = use("Test/Suite")("Pengiriman Test");

const Helpers = use("Helpers");

const Factory = use("Factory");

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");

let office;
let outfield;
let customAuth;
let customAuthTwo;

let karyawan;
let karyawanTwo;
let pelanggan;
let transaksi;
let detail;
let pembayaran;
let pekerjaan;
let pekerjaanMaterial;
let tugas;
let pengiriman;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();

  // Prepare Foreign Data
  const _karyawan = await Factory.model("App/Models/Karyawan/Karyawan").create({
    role: 5,
  });
  karyawan = _karyawan.toJSON();

  const _karyawanTwo = await Factory.model("App/Models/Karyawan/Karyawan").create({
    role: 5,
  });
  karyawanTwo = _karyawanTwo.toJSON();

  customAuth = await auth.custom(karyawan.username);
  customAuthTwo = await auth.custom(karyawanTwo.username);

  const _pelanggan = await Factory.model("App/Models/Pelanggan").create();
  pelanggan = _pelanggan.toJSON();

  // Prepare main data
  const _transaksi = await Factory.model(
    "App/Models/Transaksi/Transaksi"
  ).create({
    karyawan: pelanggan.id,
    pelanggan: karyawan.id,
    total_transaksi: 100000,
    jumlah_pembayaran: 100000, // Change this if need to test payment validation
    status: 'waiting_shipping',
  });
  transaksi = _transaksi.toJSON();

  const _detail = await Factory.model("App/Models/Transaksi/Detail").create({
    transaksi: transaksi.id,
    jenis: 2,
    price: 20000,
    qty: 5,
    status: 3,
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
    isReady: true,
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
    jumlah_selesai: 5,
    isFinish: true,
  });

  tugas = _tugas.toJSON();

  await Factory.model("App/Models/Tugas/Karyawan").create({
    tugas: tugas.id,
    karyawan: karyawan.id,
    jumlah_selesai: 5,
  });
});

test("Make sure isn't have shippment yet", async ({ client, assert }) => {
  const response = await client
    .get("api/pengiriman")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  const result = JSON.parse(response.text);
  assert.equal(result.payload.data.length, 0);
  response.assertStatus(200);
});

test("Make sure waiting shipping list is accessible", async ({ client, assert }) => {
  const response = await client
    .get("api/pengiriman/transaksi")
    .header("X-AUTH-TOKEN", office.token)
    .end();

  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
});

test("Create new pengiriman", async ({ client, assert }) => {
  const response = await client
    .post("api/pengiriman/" + transaksi.id)
    .send({
      pengirim: karyawan.id
    })
    .header("X-AUTH-TOKEN", office.token)
    .end();
  const result = JSON.parse(response.text);
  assert.equal(result.payload.message, "Data pengiriman telah diproses");
  response.assertStatus(200);
});


test("Fail when transaction is not ready to shipment", async ({ client }) => {
  const response = await client
    .post("api/pengiriman/1")
    .header("X-AUTH-TOKEN", office.token)
    .end();

  response.assertStatus(423);
});

test("Make sure shippment list is available", async ({ client, assert }) => {
  const response = await client
    .get("api/pengiriman")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  const result = JSON.parse(response.text);
  assert.equal(result.payload.data.length, 1);
  assert.isNotNull(result.payload.data[0].Transaksi);
  assert.isNotNull(result.payload.data[0].Pengirim);
  pengiriman = result.payload.data[0];
  response.assertStatus(200);
});

test("Make sure shippment detail is accessible", async ({ client, assert }) => {
  const response = await client.get(`api/pengiriman/${pengiriman.id}`)
    .header('X-AUTH-TOKEN', outfield.token)
    .end();

  const result = JSON.parse(response.text);
  assert.isNotNull(result.payload.pengiriman)
  assert.isNotNull(result.payload.pengirim)
});

test("Make sure user task is available", async ({ client, assert }) => {
  const response = await client.get('api/pengiriman/usertask')
    .header('X-AUTH-TOKEN', customAuth.token)
    .end();

  response.assertStatus(200);
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
})

test("Make sure pengiriman can change courier", async ({ client, assert }) => {
  const response = await client.put(`api/pengiriman/pengirim/${pengiriman.id}`)
    .send({
      pengirim: karyawanTwo.id
    })
    .header('X-AUTH-TOKEN', office.token)
    .end();
  
  response.assertStatus(200);

  const response_user = await client.get('api/pengiriman/usertask')
    .header('X-AUTH-TOKEN', customAuthTwo.token)
    .end();

  response_user.assertStatus(200);
  const result_user = JSON.parse(response_user.text);
  assert.isAbove(result_user.payload.length, 0);
})

test("Finish the shippment", async ({ client, assert }) => {
  const response = await client
    .put("api/pengiriman/finish/" + pengiriman.id)
    .header("X-AUTH-TOKEN", customAuthTwo.token)
    .send({
      penerima: "Adit",
    })
    .end();

  const result = JSON.parse(response.text);
  assert.equal(result.payload.message, "Pengiriman telah diselesaikan");
  response.assertStatus(200);
});

// test("Make sure isn't have shippment yet when all shipment is finish", async ({
//   client,
//   assert,
// }) => {
//   const response = await client
//     .get("api/pengiriman")
//     .header("X-AUTH-TOKEN", outfield.token)
//     .end();

//   const result = JSON.parse(response.text);
//   assert.equal(result.payload.data.length, 0);
//   response.assertStatus(200);
// });
