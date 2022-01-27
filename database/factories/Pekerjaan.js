const Factory = use("Factory");

Factory.blueprint("App/Models/Pekerjaan", async (faker, i, data) => {
  return {
    transaksi_detail: data.detail || 1,
    name: data.name || faker.word(),
    catatan: faker.word(),
    created_by: data.created_by
  };
});
