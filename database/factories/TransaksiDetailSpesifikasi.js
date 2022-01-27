const Factory = use("Factory");

Factory.blueprint(
  "App/Models/Transaksi/Detail/Spesifikasi",
  async (faker, i, data) => {
    return {
      transaksi_detail: data.detail,
      name: faker.word(),
      value: faker.word(),
    };
  }
);
