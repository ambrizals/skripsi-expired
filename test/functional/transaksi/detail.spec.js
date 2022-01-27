const Factory = use("Factory");

const { test, trait, before } = use("Test/Suite")("Detail Transaction Test");

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");
// trait("DatabaseTransactions");

let office;
let outfield;

let pelanggan;
let karyawan;
let fakeTransaksi;
let fakeDetail;
let _karyawan;
let _pelanggan;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();

  _karyawan = await Factory.model("App/Models/Karyawan/Karyawan").create({
    role: 3,
  });
  _pelanggan = await Factory.model("App/Models/Pelanggan").create();

  pelanggan = _karyawan.toJSON();
  karyawan = _pelanggan.toJSON();

  fakeTransaksi = await Factory.model("App/Models/Transaksi/Transaksi").create({
    karyawan: pelanggan.id,
    pelanggan: karyawan.id,
    status: 'quotation',
  });

  const _fakeTransaksi = fakeTransaksi.toJSON();

  fakeDetail = await Factory.model("App/Models/Transaksi/Detail").create({
    transaksi: _fakeTransaksi.id,
    jenis: 'pending',
  });

  const _fakeDetail = fakeDetail.toJSON();
});

test("Make sure detail transaction is accessible", async ({ client }) => {
  const _fakeTransaksi = fakeTransaksi.toJSON();
  const response = await client
    .get("api/transaksi/detail/" + _fakeTransaksi.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(200);
});

test("Create transaction detail product", async ({ client }) => {
  const _fakeTransaksi = fakeTransaksi.toJSON();
  const response = await client
    .post("api/transaksi/detail/" + _fakeTransaksi.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      jenis: 0,
      produk: 1,
      qty: 1,
      price: 500000,
      deskripsi: "Ini Clear Gloss",
      name: "Kursi Makan Rattan"
    })
    .end();
  response.assertStatus(200);
});

test("Create transaction detail custom", async ({ client }) => {
  const _fakeTransaksi = fakeTransaksi.toJSON();
  const response = await client
    .post("api/transaksi/detail/" + _fakeTransaksi.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      jenis: 1,
      name: "Kitchen Set",
      qty: 1,
      price: 5000000,
      deskripsi: "Ini Clear Gloss",
    })
    .end();
  response.assertStatus(200);
});

test("Create mass transaction detail", async ({ client }) => {
  const _fakeTransaksi = fakeTransaksi.toJSON();
  const response = await client
    .post("api/transaksi/detail/mass/" + _fakeTransaksi.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      data: [
        {
          jenis: 0,
          produk: 2,
          qty: 1,
          price: 500000,
          deskripsi: "Ini Clear Gloss",
        },
        {
          jenis: 1,
          name: "Kitchen Set",
          qty: 1,
          price: 3000000,
          deskripsi: "HPL Carta",
        },
      ],
    })
    .end();
  response.assertStatus(200);
});

test("Update transaction detail", async ({ client }) => {
  const _fakeDetail = fakeDetail.toJSON();
  const response = await client
    .put("api/transaksi/detail/" + _fakeDetail.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      qty: 1,
      price: 2500000,
      deskripsi: "HPL Carta 2",
      name: "Meja Belajar"
    })
    .end();
  response.assertStatus(200);
});

test("Update transaction detail partial", async ({ client }) => {
  const _fakeDetail = fakeDetail.toJSON();
  const response = await client
    .put("api/transaksi/detail/" + _fakeDetail.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      name: "Meja Belajar 200 x 60"
    })
    .end();
  response.assertStatus(200);
});

test("Delete transaction detail", async ({ client }) => {
  const _fakeDetail = fakeDetail.toJSON();
  const response = await client
    .delete("api/transaksi/detail/" + _fakeDetail.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  response.assertStatus(200);
});
