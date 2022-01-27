const Route = use("Route");

Route.group(() => {
  Route.get(":id", "GambarController.show").as("transaksi.detail.gambar.index");
  Route.post(":id", "GambarController.store")
    .as("transaksi.detail.gambar.store")
    .middleware("office");
  Route.delete(":id", "GambarController.destroy")
    .as("transaksi.detail.gambar.delete")
    .middleware("office");
  Route.put("cover/:id", "GambarController.updateCover")
    .as("transaksi.detail.gambar.setCover")
    .middleware("office");
})
  .prefix("api/transaksi/detail/gambar")
  .middleware("jwt")
  .namespace("Transaksi");
