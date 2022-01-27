"use strict";

/*
|--------------------------------------------------------------------------
| InsertTransaksiSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const faker = require("faker");

const Karyawan = use("App/Models/Karyawan/Karyawan");
const Transaksi = use("App/Models/Transaksi/Transaksi");
const Pelanggan = use("App/Models/Pelanggan");

const Produk = use("App/Models/Produk/Produk");
const TransaksiDetail = use("App/Models/Transaksi/Detail");
const TransaksiDetailProduk = use("App/Models/Transaksi/Detail/Produk");

const Pekerjaan = use("App/Models/Pekerjaan");
const PekerjaanMaterial = use("App/Models/Pekerjaan/Material");
const PekerjaanPengeluaran = use("App/Models/Pekerjaan/Pengeluaran");

const Tugas = use("App/Models/Tugas");
const TugasKaryawan = use("App/Models/Tugas/Karyawan");

class InsertTransaksiSeeder {
  async run () {
    const _produk = await Produk.create({
      name: "Kursi Rattan Tanganan Oval",
      price: 500000,
    });

    const produk = _produk.toJSON();

    const karyawan = {
      role: 2,
      username: "bams",
      password: "radiohead4403",
      fullname: "Bambang Sutrisno",
      home_address: "Jl. Letda Made Putra",
      phone_number: "081239234580",
      is_active: true,
    };
    const _karyawan = await Karyawan.create(karyawan);
    const dataKaryawan = _karyawan.toJSON();

    const pelanggan = {
      name: "NKR",
      address: "Jl. Gunung Tangkuban Perahu",
      phone: faker.phone.phoneNumberFormat(),
      isReseller: 1,
    };
    const _pelanggan = await Pelanggan.create(pelanggan);
    const dataPelanggan = _pelanggan.toJSON();

    const transaksi = {
      karyawan: dataKaryawan.id,
      pelanggan: dataPelanggan.id,
      penerima: faker.name.findName(),
      alamat_pengiriman: faker.address.streetAddress(),
      jumlah_pembayaran: 510000,
      nomor_telepon: faker.phone.phoneNumberFormat(),
      status: 'waiting_confirmation',
    };

    const _transaksi = await Transaksi.create(transaksi);
    const transaksiData = _transaksi.toJSON();

    const _transaksiDetail1 = await TransaksiDetail.create({
      transaksi: transaksiData.id,
      jenis: 0,
      qty: 1,
      price: produk.price,
      deskripsi: "Di Finishing Clear Doff",
      name: 'Kursi Rattan Tanganan Oval'
    });

    const transaksiDetail1 = _transaksiDetail1.toJSON();

    const _pekerjaan1 = await Pekerjaan.create({
      transaksi_detail: transaksiDetail1.id,
      name: "Kursi Makan Rattan",
      catatan: faker.random.word(),
    });
    const pekerjaan1 = _pekerjaan1.toJSON();

    await PekerjaanMaterial.createMany([
      {
        pekerjaan: pekerjaan1.id,
        karyawan: dataKaryawan.id,
        name: "Kor Rotan Ukuran 15",
        qty: "10",
        satuan: "kg",
      },
      {
        pekerjaan: pekerjaan1.id,
        karyawan: dataKaryawan.id,
        name: "Kor Rotan Ukuran 10",
        qty: "10",
        satuan: "kg",
      },
    ]);

    await PekerjaanPengeluaran.createMany([
      {
        pekerjaan: pekerjaan1.id,
        name: "Pembelian Kor Rotan Ukuran 15",
        biaya: 500000,
      },
      {
        pekerjaan: pekerjaan1.id,
        name: "Pembelian Kor Rotan Ukuran 10",
        biaya: 500000,
      },
    ]);

    const _tugas = await Tugas.create({
      pekerjaan: pekerjaan1.id,
      penerima: 2,
      jumlah_selesai: 1,
      name: "Kerja Semua",
    });

    const tugas = _tugas.toJSON();

    await TugasKaryawan.create({
      tugas: tugas.id,
      karyawan: dataKaryawan.id,
      jumlah_selesai: 1,
    });

    const _trxDtlProduk = await TransaksiDetailProduk.create({
      transaksi_detail: transaksiDetail1.id,
      produk: produk.id,
    });

    const transaksiDetailProduk = _trxDtlProduk.toJSON();

    const _transaksiDetail2 = await TransaksiDetail.create({
      transaksi: transaksiData.id,
      jenis: 2,
      qty: 1,
      price: 10000,
      deskripsi: "Rel Lepas",
    });

    const transaksiDetail2 = _transaksiDetail2.toJSON();


    await _transaksiDetail2.Spesifikasi().createMany([
      {
        name: faker.random.word(),
        value: faker.random.word(),
      },
      {
        name: faker.random.word(),
        value: faker.random.word(),
      },
    ]);

    await _transaksi.Pembayaran().createMany([
      {
        jumlah_pembayaran: 10000,
      },
      {
        jumlah_pembayaran: 500000,
      },
    ]);
  }
}

module.exports = InsertTransaksiSeeder;
