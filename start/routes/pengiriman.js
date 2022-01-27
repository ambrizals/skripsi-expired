const Route = use("Route");

Route.group(function () {
  Route.get('transaksi', 'PengirimanController.transaksi')
    .as('pengiriman.transaksi')
    .middleware('office');
  Route.get('usertask', 'PengirimanController.userTask').as('pengiriman.usertask');
  Route.put("finish/:id", "PengirimanController.markFinish").as(
    "pengiriman.finish"
  );
  Route.put("pengirim/:id", "PengirimanController.updatePengirim")
    .as("pengiriman.updatePengirim")
    .middleware('office');
  Route.get("/", "PengirimanController.index").as("pengiriman.index");
  Route.get(":id", "PengirimanController.show").as("pengiriman.show");
  Route.post(":id", "PengirimanController.store")
    .as("pengiriman.store")
    .middleware("office");
})
  .prefix("api/pengiriman")
  .middleware("jwt");
