const Route = use("Route");

// Spesifikasi Produk Routes

Route.group(function () {
  Route.post(":id", "SpesifikasiController.store")
    .middleware("office")
    .validator("Produk/Spesifikasi")
    .as("produk.spesifikasi.store");
  Route.get(":id", "SpesifikasiController.show").as("produk.spesifikasi.store");
  Route.put(":id", "SpesifikasiController.update")
    .middleware("office")
    .validator("Produk/Spesifikasi")
    .as("produk.spesifikasi.update");
  Route.delete(":id", "SpesifikasiController.destroy")
    .middleware("office")
    .as("produk.spesifikasi.delete");
  Route.get(":id/detail", "SpesifikasiController.product").as(
    "produk.spesifikasi.detail"
  );
})
  .prefix("api/product/specs")
  .namespace("Produk")
  .middleware("jwt");
