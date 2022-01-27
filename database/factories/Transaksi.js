const Factory = use("Factory");
const Time = use("Time");

Factory.blueprint("App/Models/Transaksi/Transaksi", async (faker, i, data) => {
  return {
    no_transaksi: '',
    karyawan: data.karyawan,
    pelanggan: data.pelanggan,
    penerima: faker.word(),
    alamat_pengiriman: faker.address(),
    total_transaksi:
      data.total_transaksi || faker.integer({ min: 600000, max: 1200000 }),
    jumlah_pembayaran: data.jumlah_pembayaran || 0,
    nomor_telepon: faker.phone(),
    status: data.status || 'quotation',
  };
});
