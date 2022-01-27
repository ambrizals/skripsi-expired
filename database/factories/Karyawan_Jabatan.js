const Factory = use("Factory");

Factory.blueprint("App/Models/Karyawan/Jabatan", async (faker) => {
  return {
    name: faker.word(),
    isOffice: false,
    isOwner: false,
  };
});
