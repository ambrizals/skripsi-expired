const faker = require("faker");

const Factory = use("Factory");

const { test, trait, before } = use("Test/Suite")(
  "Detail Transaction Spesification Test"
);

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");

let office;
let outfield;

// method variable
let _karyawan;
let _pelanggan;
let _transaksi;
let _detail;
let _spesifikasi;

let karyawan;
let pelanggan;
let transaksi;
let detail;
let spesifikasi;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();

  // Prepare Foreign Data
  _karyawan = await Factory.model("App/Models/Karyawan/Karyawan").create({
    role: 3,
  });
  karyawan = _karyawan.toJSON();
  _pelanggan = await Factory.model("App/Models/Pelanggan").create();
  pelanggan = _pelanggan.toJSON();

  // Prepare main data
  _transaksi = await Factory.model("App/Models/Transaksi/Transaksi").create({
    karyawan: pelanggan.id,
    pelanggan: karyawan.id,
    status: 'waiting_confirmation'
  });
  transaksi = _transaksi.toJSON();

  _detail = await Factory.model("App/Models/Transaksi/Detail").create({
    transaksi: transaksi.id,
    jenis: 0,
  });
  detail = _detail.toJSON();

  _spesifikasi = await Factory.model(
    "App/Models/Transaksi/Detail/Spesifikasi"
  ).create({
    detail: detail.id,
  });
  spesifikasi = _spesifikasi.toJSON();

  _spesifikasi2 = await Factory.model(
    "App/Models/Transaksi/Detail/Spesifikasi"
  ).create({
    detail: detail.id,
  });
  spesifikasi2 = _spesifikasi2.toJSON();
});

test("Create spesification detail", async ({ client, assert }) => {
  const response = await client
    .post("api/transaksi/detail/specs/" + detail.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      name: faker.random.word(),
      value: faker.random.word(),
    })
    .end();
  const result = JSON.parse(response.text);
  assert.equal(result.payload.message, "Data berhasil di masukkan");
  response.assertStatus(200);
});

test("Show spesification detail", async ({ client, assert }) => {
  const response = await client
    .get("api/transaksi/detail/specs/" + detail.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
});

test("Update spesification detail", async ({ client, assert }) => {
  const response = await client
    .put("api/transaksi/detail/specs/" + spesifikasi.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      value: faker.random.word(),
    })
    .end();
  const result = JSON.parse(response.text);
  assert.equal(result.payload.message, "Data berhasil di ubah");
  response.assertStatus(200);
});

test("Delete spesification detail", async ({ client, assert }) => {
  const response = await client
    .delete("api/transaksi/detail/specs/" + spesifikasi.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  const result = await JSON.parse(response.text);
  assert.equal(result.payload.message, "Spesifikasi berhasil di hapus !");
  response.assertStatus(200);

  const response2 = await client
    .delete("api/transaksi/detail/specs/" + spesifikasi2.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  const result2 = await JSON.parse(response2.text);
  assert.equal(result2.payload.message, "Spesifikasi berhasil di hapus !");
  response.assertStatus(200);  
});
