const Route = use("Route");

Route.group(function () {
  Route.get(":id", "PengeluaranController.show").as(
    "pekerjaan.pengeluaran.show"
  );
  Route.post(":id", "PengeluaranController.store").as(
    "pekerjaan.pengeluaran.store"
  );
  Route.delete(":id", "PengeluaranController.destroy").as(
    "pekerjaan.pengeluaran.destroy"
  );
})
  .prefix("api/pekerjaan/pengeluaran")
  .middleware(["jwt", "office"])
  .namespace("Pekerjaan");
