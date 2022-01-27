const Factory = use("Factory");

Factory.blueprint(
  "App/Models/Pekerjaan/MaterialPengeluaran",
  async (faker, i, data) => {
    return {
      pekerjaan_material: data.pekerjaan_material,
      pekerjaan_pengeluaran: data.pekerjaan_pengeluaran,
      material: data.material,
      qty: data.qty,
      price: data.price,
    };
  }
);
