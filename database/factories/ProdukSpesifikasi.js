const Factory = use("Factory");

Factory.blueprint("App/Models/Produk/Spesifikasi", async (faker) => {
  return {
    produk: 1,
    name: faker.word(),
    value: faker.word(),
  };
});
