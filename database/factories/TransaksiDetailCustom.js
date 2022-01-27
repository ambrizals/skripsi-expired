const Factory = use("Factory");

Factory.blueprint(
  "App/Models/Transaksi/Detail/Custom",
  async (faker, i, data) => {
    return {
      transaksi_detail: data.transaksi_detail || 1,
      name: data.name || faker.word(),
    };
  }
);
