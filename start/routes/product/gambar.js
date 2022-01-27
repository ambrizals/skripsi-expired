const Route = use("Route");

// Gambar Produk Routes

Route.group(function () {
  Route.get(":id", "GambarController.show").as("produk.gambar.show");
  Route.post(":id", "GambarController.store")
    .validator("Produk/Gambar")
    .middleware("office")
    .as("produk.gambar.store");
  Route.delete(":id", "GambarController.destroy")
    .middleware("office")
    .as("produk.gambar.delete");
  Route.put("cover/:id", 'GambarController.setCover')
    .middleware('office')
    .as('produk.gambar.setCover')
})
  .prefix("api/product/image")
  .namespace("Produk");
