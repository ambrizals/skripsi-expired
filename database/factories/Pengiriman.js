const Factory = use("Factory");

Factory.blueprint("App/Models/Pengiriman", async (faker, i, data) => {
  return {
    transaksi: data.transaksi,
    pengirim: data.pengirim,
    penerima: data.penerima || null,
  };
});
