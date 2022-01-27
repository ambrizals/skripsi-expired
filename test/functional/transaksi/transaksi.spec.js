const faker = require("faker");

const Factory = use("Factory");

const { test, trait, before } = use("Test/Suite")("Transaction Test");

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");
// trait("DatabaseTransactions");

let office;
let outfield;

let pelanggan;
let karyawan;
let fakeData;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();

  const _karyawan = await Factory.model("App/Models/Karyawan/Karyawan").create({
    role: 3,
  });
  const _pelanggan = await Factory.model("App/Models/Pelanggan").create();

  pelanggan = _karyawan.toJSON();
  karyawan = _pelanggan.toJSON();

  fakeData = await Factory.model("App/Models/Transaksi/Transaksi").create({
    karyawan: pelanggan.id,
    pelanggan: karyawan.id,
  });
});

test("Make sure transaction list is accessible", async ({ client, assert }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .get("api/transaksi")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  response.assertStatus(200);

  const data = response.body.payload.data

  const response_search_transaksi = await client.get(`api/transaksi?no_transaksi=${data[0].no_transaksi}`)
    .header('X-AUTH-TOKEN', office.token)
    .end()

  response_search_transaksi.assertStatus(200)
  assert.notEqual(response_search_transaksi.body.payload.total, 0)

  const response_search_customer = await client.get(`api/transaksi?pelanggan=${data[0].pelanggan}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();
  response_search_customer.assertStatus(200);
  assert.notEqual(response_search_customer.body.payload.total, 0);

  const response_status_selection = await client.get(`api/transaksi?status=${_fakeData.status}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();

  response_status_selection.assertStatus(200);
  assert.notEqual(response_status_selection.body.payload.total, 0);
});

test("Make sure all employee can create offer / new transaction", async ({
  client,
}) => {
  const response = await client
    .post("api/transaksi")
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      pelanggan: faker.random.word(),
      penerima: faker.random.word(),
      alamat_pengiriman: faker.address.streetAddress(),
      nomor_telepon: faker.phone.phoneNumberFormat(),
    })
    .end();
  response.assertStatus(200);
});

test("Make sure transaction detail is accessible", async ({ client, assert }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client.get(`api/transaksi/${_fakeData.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();

  response.assertStatus(200);
  assert.isNotNull(response.body.payload.Pelanggan.name)
  assert.isNotNull(response.body.payload.Karyawan.fullname)
})

test("Make sure all employee can update transaction", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .put("api/transaksi/" + _fakeData.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      alamat_pengiriman: faker.address.streetAddress(),
    })
    .end();
  response.assertStatus(200);
});

test("Make sure outfield employee can't revoke transaction", async ({
  client,
}) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .delete("api/transaksi/" + _fakeData.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(401);
});

test("Make sure office employee can revoke transaction", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .delete("api/transaksi/" + _fakeData.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  response.assertStatus(200);
});