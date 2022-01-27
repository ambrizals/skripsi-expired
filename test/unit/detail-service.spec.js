"use strict";

const Factory = use("Factory");
const { test, before } = use("Test/Suite")("Detail Service");

const DetailService = use("App/Services/Transaksi/DetailService");

const detail = new DetailService();

let transaction;
let detailData;

before(async () => {
  const _karyawan = await Factory.model("App/Models/Karyawan/Karyawan").create({
    role: 3,
  });
  const _pelanggan = await Factory.model("App/Models/Pelanggan").create();

  const pelanggan = _karyawan.toJSON();
  const karyawan = _pelanggan.toJSON();

  const fakeTransaksi = await Factory.model(
    "App/Models/Transaksi/Transaksi"
  ).create({
    karyawan: pelanggan.id,
    pelanggan: karyawan.id,
    status: 'quotation',
  });

  transaction = fakeTransaksi.toJSON();

  const _detail = await Factory.model("App/Models/Transaksi/Detail").create({
    transaksi: transaction.id,
    jenis: 1,
  });

  detailData = _detail.toJSON();
});

test("Make sure create method is work !", async ({ assert }) => {
  const data = await detail.single().create(
    {
      jenis: 0,
      produk: 2,
      qty: 1,
      price: 500000,
      deskripsi: "Ini Clear Gloss",
    },
    transaction.id
  );
  assert.equal(data, true);
});

test("Make sure update method is work !", async ({ assert }) => {
  const data = await detail.updateDetail(
    {
      qty: 1,
      price: 2500000,
      deskripsi: "HPL Carta 2",
    },
    detailData.id
  );
  assert.equal(data, true);
});
