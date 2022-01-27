const Factory = use("Factory");

Factory.blueprint("App/Models/Material/Material", async (faker, i, data) => {
  return {
    supplier: data.supplier,
    name: faker.word(),
    price: faker.integer({ min: 15000, max: 150000 }),
  };
});
