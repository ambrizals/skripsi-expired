const Route = use("Route");

// Supplier Routes

Route.group(function () {
  Route.get("/", "SupplierController.index").as("material.supplier.list");
  Route.post("/", "SupplierController.store")
    .as("material.supplier.create")
    .validator("Material/CreateSupplier")
    .middleware("office");
  Route.get('/suggest', 'SupplierController.suggest').as('material.supplier.suggest').middleware('office');
  Route.get(":id", "SupplierController.show").as("material.supplier.show");
  Route.put(":id", "SupplierController.update")
    .as("material.supplier.update")
    .middleware("office");
})
  .prefix("api/material/supplier")
  .namespace("Material")
  .middleware("jwt");
