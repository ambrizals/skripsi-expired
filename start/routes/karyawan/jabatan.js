const Route = use("Route");

// Jabatan Karyawan

Route.group(function () {
  Route.get("/", "JabatanController.index").as("jabatan.karyawan.index").middleware('office');
  Route.post("/", "JabatanController.store")
    .validator("Employee/Role")
    .as("jabatan.karyawan.store")
    .middleware('owner');
  Route.put(":id", "JabatanController.update").as("jabatan.karyawan.update").middleware('owner');
})
  .prefix("api/employee/role")
  .namespace("Karyawan")
  .middleware('jwt');
