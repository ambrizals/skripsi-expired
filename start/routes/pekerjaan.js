const Route = use("Route");

require("./pekerjaan/material");
require("./pekerjaan/pengeluaran");
require("./pekerjaan/tugas");

Route.group(function () {
  Route.get('readylist', 'PekerjaanController.readyList').as('pekerjaan.readylist');
  Route.put("finish/:id", "PekerjaanController.markFinish").as(
    "pekerjaan.finish");
  Route.get("/", "PekerjaanController.index").as("pekerjaan.index");
  Route.post(":id", "PekerjaanController.store").as("pekerjaan.store");
  Route.get(":id", "PekerjaanController.show").as("pekerjaan.show");
  Route.put(':id', "PekerjaanController.update").as("pekerjaan.update");

})
  .prefix("api/pekerjaan")
  .middleware(["jwt", "office"]);
