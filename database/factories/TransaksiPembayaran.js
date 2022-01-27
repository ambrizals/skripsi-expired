const Factory = use("Factory");

Factory.blueprint("App/Models/Transaksi/Pembayaran", async (faker, i, data) => {
  return {
    transaksi: data.transaksi,
    jumlah_pembayaran: data.jumlah_pembayaran,
    id_karyawan: data.karyawan || 1
  };
});
