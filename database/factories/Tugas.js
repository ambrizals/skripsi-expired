const Factory = use("Factory");

Factory.blueprint("App/Models/Tugas", async (faker, i, data) => {
  return {
    pekerjaan: data.pekerjaan || 1,
    penerima: data.penerima || 1,
    name: data.name || faker.word(),
    target_selesai: data.target_selesai,
    jumlah_selesai: data.jumlah_selesai || 0,
  };
});
