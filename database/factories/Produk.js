const Factory = use("Factory");

Factory.blueprint("App/Models/Produk/Produk", async (faker) => {
  return {
    name: faker.word(),
    price: 500000,
  };
});
