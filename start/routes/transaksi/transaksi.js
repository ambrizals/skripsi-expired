const Route = use("Route");

Route.group(function () {
  Route.get("/", "TransaksiController.index").as("transaksi.index");
  Route.post("/", "TransaksiController.store")
    .as("transaksi.create")
    .validator("Transaksi/CreateTransaksi");
  Route.get(":id", "TransaksiController.show").as("transaksi.show");
  Route.put(":id", "TransaksiController.update").as("transaksi.update");
  Route.delete(":id", "TransaksiController.revoke")
    .middleware("office")
    .as("transaksi.revoke");
})
  .prefix("api/transaksi")
  .middleware("jwt")
  .namespace("Transaksi");
