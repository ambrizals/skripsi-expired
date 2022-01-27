const Factory = use("Factory");

Factory.blueprint("App/Models/Pekerjaan/MaterialPermintaan", async (faker, i, data) => {
  return {
    pekerjaan: data.pekerjaan || 1,
    karyawan: data.karyawan || 1,
    name: data.name || faker.word(),
    qty: data.qty || 3,
  };
});
