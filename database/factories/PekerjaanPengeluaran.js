const Factory = use("Factory");

Factory.blueprint(
  "App/Models/Pekerjaan/Pengeluaran",
  async (faker, i, data) => {
    return {
      pekerjaan: data.pekerjaan || 1,
      karyawan: data.karyawan || 1,
      name: data.name || faker.word(),
      biaya: data.biaya || faker.integer({ min: 10000, max: 100000 }),
      isMaterial: data.isMaterial || false,
    };
  }
);
