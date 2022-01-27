const Route = use("Route");

Route.group(function () {
  Route.get(":id", "PembayaranController.show").as("transaksi.pembayaran.show").middleware('office');
  Route.post(":id", "PembayaranController.store")
    .as("transaksi.pembayaran.store")
    .validator("Transaksi/Pembayaran");
})
  .prefix("api/transaksi/pembayaran")
  .middleware("jwt")
  .namespace("Transaksi");
