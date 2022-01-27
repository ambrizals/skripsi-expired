const Factory = use("Factory");

Factory.blueprint("App/Models/Material/Supplier", async (faker) => {
  return {
    name: faker.company(),
    type: faker.sentence({ word: 2 }),
    address: faker.address(),
    phone: faker.phone({ formatted: false }),
  };
});
