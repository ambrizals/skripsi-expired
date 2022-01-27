const Factory = use("Factory");

Factory.blueprint("App/Models/Pelanggan", async (faker) => {
  return {
    name: faker.name(),
    address: faker.address(),
    phone: faker.phone(),
    isReseller: faker.integer({ min: 0, max: 1 }),
  };
});
