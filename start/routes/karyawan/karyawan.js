const Route = use("Route");

// Karyawan Routes

Route.group(function () {
  Route.get("/", "KaryawanController.index").as("karyawan.index");
  Route.post("/", "KaryawanController.store")
    .validator("Employee/CreateEmployee")
    .as("karyawan.create");
  Route.put("password/:id", "KaryawanController.forcePassword")
    .validator('Employee/ForcePassword')
    .as('karyawan.forcePassword')
  Route.get(":id", "KaryawanController.show").as("karyawan.store");
  Route.put(":id", "KaryawanController.update")
    .validator("Employee/UpdateEmployee")
    .as("karyawan.update");
})
  .prefix("api/employee")
  .namespace("Karyawan")
  .middleware(["jwt", "owner"]);

Route.group(function() {
  Route.get('/suggest', 'KaryawanController.suggest').as('karyawan.suggest');
}).prefix('api/karyawan').namespace('Karyawan').middleware(['jwt', 'office'])