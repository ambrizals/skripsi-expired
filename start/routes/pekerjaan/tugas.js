const Route = use("Route");

Route.group(function () {
  Route.get('detail/:id', 'TugasController.detail').as('pekerjaan.office.detail');
  Route.get('history/:id', 'TugasController.history').as('pekerjaan.office.history');
  Route.delete('revoke/:id', 'TugasController.revokeHistory').as('pekerjaan.office.revokeTugasHistory');
  Route.get(":id", "TugasController.show").as("pekerjaan.office.show");
  Route.post(":id", "TugasController.store").as("pekerjaan.office.store");
  Route.delete(":id", "TugasController.destroy").as("pekerjaan.office.destroy");
})
  .prefix("api/pekerjaan/tugas")
  .middleware(["jwt", "office"])
  .namespace("Pekerjaan");
