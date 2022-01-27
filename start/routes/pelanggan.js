const Route = use("Route");

Route.group(function () {
  Route.get("/", "PelangganController.index").as("pelanggan.index");
  Route.get("/suggest", "PelangganController.suggest").as("pelanggan.suggest");
  Route.post("/", "PelangganController.store").as("pelanggan.create");
  Route.put(":id", "PelangganController.update")
    .as("pelanggan.update")
    .middleware("office");
})
  .prefix("api/pelanggan")
  .middleware("jwt");
