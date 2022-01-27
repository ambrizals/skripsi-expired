const Route = use("Route");

Route.group(() => {
  Route.get(":id", "DetailController.show").as("transaksi.detail.index");
  Route.post(":id", "DetailController.store").as("transaksi.detail.store");
  Route.post("mass/:id", "DetailController.massStore").as(
    "transaksi.detail.massStore"
  );
  Route.put(":id", "DetailController.update").as("transaksi.detail.update");
  Route.delete(":id", "DetailController.destroy").as("transaksi.detail.delete");
})
  .prefix("api/transaksi/detail")
  .middleware("jwt")
  .namespace("Transaksi");
