const Route = use("Route");

Route.group(() => {
  Route.post(":id", "SpesifikasiController.store")
    .as("transaksi.detail.spesifikasi.store")
    .validator("Transaksi/DetailSpesifikasi");
  Route.get(":id", "SpesifikasiController.show").as(
    "transaksi.detail.spesifikasi.show"
  );
  Route.put(":id", "SpesifikasiController.update").as(
    "transaksi.detail.spesifikasi.update"
  );
  Route.delete(":id", "SpesifikasiController.destroy").as(
    "transaksi.detail.spesifikasi.delete"
  );
})
  .prefix("api/transaksi/detail/specs")
  .namespace("Transaksi")
  .middleware("jwt");
