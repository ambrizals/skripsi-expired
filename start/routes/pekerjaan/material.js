const Route = use("Route");

Route.group(function () {
  Route.put('accept/:id', 'MaterialController.acceptRequest').as('pekerjaan.material.acceptRequest')
  Route.get('request/:id', 'MaterialController.requestList').as('material.request');
  Route.get(":id", "MaterialController.show").as("pekerjaan.material.show");
  Route.post(":id", "MaterialController.store").as("pekerjaan.material.store");
  Route.delete(":id", "MaterialController.destroy").as('pekerjaan.material.destroy');
})
  .prefix("api/pekerjaan/material")
  .middleware(["jwt", "office"])
  .namespace("Pekerjaan");
