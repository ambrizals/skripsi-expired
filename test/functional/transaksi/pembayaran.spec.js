const Helpers = use("Helpers");

const Factory = use("Factory");

const { test, trait, before } = use("Test/Suite")("Transaction Payment Test");

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
let _pembayaran;

let karyawan;
let pelanggan;
let transaksi;
let detail;
let pembayaran;

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
    karyawan: karyawan.id,
    pelanggan: pelanggan.id,
    jumlah_pembayaran: 100000,
  });
  transaksi = _transaksi.toJSON();

  _detail = await Factory.model("App/Models/Transaksi/Detail").create({
    transaksi: transaksi.id,
    jenis: 1,
    price: 100000,
  });
  detail = _detail.toJSON();

  _pembayaran = await Factory.model("App/Models/Transaksi/Pembayaran").create({
    transaksi: transaksi.id,
    jumlah_pembayaran: 30000,
    id_karyawan: office.user.id
  });

  pembayaran = _pembayaran.toJSON();
});

test("Show payment list of fake transaction", async ({ client, assert }) => {
  const response = await client
    .get("api/transaksi/pembayaran/" + transaksi.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
  assert.isNotNull(result.payload[0].Karyawan.fullname);
});

test("Show payment list of fake transaction can't access by outfield employee", async ({
  client,
}) => {
  const response = await client
    .get("api/transaksi/pembayaran/" + transaksi.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  response.assertStatus(401);
});

test("Outfield employee can create payment", async ({ client }) => {
  const response = await client
    .post("api/transaksi/pembayaran/" + transaksi.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      jumlah_pembayaran: 50000,
    })
    .end();


  const response_check = await client
    .post("api/transaksi/pembayaran/" + transaksi.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      jumlah_pembayaran: 50000,
    })
    .end();

  response_check.assertStatus(200);
});

test("Create payment to fake transaction", async ({ client, assert }) => {
  const response = await client
    .post("api/transaksi/pembayaran/" + transaksi.id)
    .header("X-AUTH-TOKEN", office.token)
    .send({
      jumlah_pembayaran: 60000,
    })
    .end();
  const result = JSON.parse(response.text);
  assert.equal(result.payload.message, "Pembayaran berhasil di simpan");
  response.assertStatus(200);

  const response_check_transaction = await client.get(`api/transaksi/${transaksi.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();
  
  response_check_transaction.assertStatus(200)
  const check_result = JSON.parse(response_check_transaction.text);
  assert.equal(check_result.payload.status, 'waiting_confirmation');
});

test("Refund payment from revoke transaction", async ({ client }) => {
  const response = await client.delete(`api/transaksi/${transaksi.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();

  response.assertStatus(200);
});

test("When transaction ID isn't registered !", async ({ client, assert }) => {
  const response = await client
    .post("api/transaksi/pembayaran/500")
    .header("X-AUTH-TOKEN", office.token)
    .send({
      jumlah_pembayaran: 70000,
    })
    .end();
  response.assertStatus(400);
});
