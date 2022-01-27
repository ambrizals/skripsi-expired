const Route = use("Route");
// Material Routes

Route.group(function () {
  Route.get("/", "MaterialController.index").as("material.index");
  Route.post("/", "MaterialController.store")
    .middleware("office")
    .as("material.store");
  Route.get('/suggest','MaterialController.suggest').as('material.suggest');
  Route.put(":id", "MaterialController.update")
    .middleware("office")
    .as("material.update");
})
  .prefix("api/material")
  .namespace("Material")
  .middleware("jwt");
