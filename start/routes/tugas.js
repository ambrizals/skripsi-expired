const Route = use("Route");

Route.group(function () {
  Route.get("/", "TugasController.index").as("tugas.index");
  Route.get(':id', 'TugasController.show').as('tugas.show');
  Route.post(":id", "TugasController.store").as("tugas.store");
  Route.get("detail/:id", "TugasController.detail").as("tugas.detail");
  Route.post('request/:id', 'TugasController.requestMaterial').as('tugas.requestMaterial');
})
  .prefix("api/tugas")
  .middleware("jwt");
