const Factory = use("Factory");

Factory.blueprint("App/Models/Transaksi/Detail", async (faker, i, data) => {
  return {
    transaksi: data.transaksi || 1,
    jenis: data.jenis || 0,
    qty: data.qty || 1,
    price: data.price || 100000,
    deskripsi: faker.word(),
    name: data.name || faker.word()
  };
});
