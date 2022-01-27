const Factory = use("Factory");

Factory.blueprint(
  "App/Models/Transaksi/Detail/Gambar",
  async (faker, i, data) => {
    return {
      transaksi_detail: data.transaksi_detail || 1,
      name: faker.word(),
      isAssets: data.isAssets || false,
    };
  }
);
