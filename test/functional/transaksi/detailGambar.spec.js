const Helpers = use("Helpers");

const Factory = use("Factory");

const { test, trait, before } = use("Test/Suite")(
  "Detail Transaction Images Test"
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
let _gambar;
let _gambarAsset;

let karyawan;
let pelanggan;
let transaksi;
let detail;
let gambar;
let gambarAsset;

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
  });
  transaksi = _transaksi.toJSON();

  _detail = await Factory.model("App/Models/Transaksi/Detail").create({
    transaksi: transaksi.id,
    jenis: 'pending',
  });
  detail = _detail.toJSON();

  _gambar = await Factory.model("App/Models/Transaksi/Detail/Gambar").create({
    transaksi_detail: detail.id,
  });

  gambar = _gambar.toJSON();

  _gambarAsset = await Factory.model("App/Models/Transaksi/Detail/Gambar").create({
    transaksi_detail: detail.id,
    isAssets: true
  });

  gambarAsset = _gambarAsset.toJSON();  
});

test("Make sure images detail transaction is accessible", async ({
  client,
  assert,
}) => {
  const response = await client
    .get("api/transaksi/detail/gambar/" + detail.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  response.assertStatus(200);
});

test("Make sure outfield employee can't upload image detail", async ({
  client,
}) => {
  const response = await client
    .post("api/transaksi/detail/gambar/" + detail.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .attach("image", Helpers.resourcesPath("test/IMG-20200820-WA0003.jpg"))
    .end();

  response.assertStatus(401);
});

test("Make sure office employee can upload image detail", async ({
  client,
  assert,
}) => {
  const response = await client
    .post("api/transaksi/detail/gambar/" + detail.id)
    .header("X-AUTH-TOKEN", office.token)
    .attach("image", Helpers.resourcesPath("test/IMG-20200820-WA0003.jpg"))
    .field("isAssets", "false")
    .end();
  const result = JSON.parse(response.text);
  assert.equal(result.payload.message, "Gambar berhasil di upload");
  response.assertStatus(200);
});

test("Make sure outfield employee can't set cover detail", async ({ client }) => {
  const response = await client
    .put("api/transaksi/detail/gambar/cover/" + gambar.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(401);
});

test("Set cover images for transaction detail", async ({ client }) => {
  const response = await client
    .put("api/transaksi/detail/gambar/cover/" + gambar.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  response.assertStatus(200);
});


test("Make sure outfield employee can't delete image detail", async ({
  client,
}) => {
  const response = await client
    .delete("api/transaksi/detail/gambar/" + gambar.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(401);
});

test("Make sure office employee can delete image detail", async ({
  client,
  assert,
}) => {
  const response = await client
    .delete("api/transaksi/detail/gambar/" + gambar.id)
    .header("X-AUTH-TOKEN", office.token)
    .field("isAssets", "false")
    .end();
  const result = JSON.parse(response.text);
  assert.equal(result.payload.message, "Gambar berhasil di hapus !");
  response.assertStatus(200);
});

test("Make sure office employee can't delete product image detail", async ({
  client,
  assert,
}) => {
  const response = await client
    .delete("api/transaksi/detail/gambar/" + gambarAsset.id)
    .header("X-AUTH-TOKEN", office.token)
    .field("isAssets", "false")
    .end();
  response.assertStatus(406);
});
