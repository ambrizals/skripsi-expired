const Factory = use("Factory");

Factory.blueprint("App/Models/Tugas/Karyawan", async (faker, i, data) => {
  return {
    tugas: data.tugas,
    karyawan: data.karyawan,
    pekerjaan: data.pekerjaan,
    created_by: data.created_by || 1,
    jumlah_selesai: data.jumlah_selesai
  };
});
