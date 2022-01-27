const Route = use("Route");

// Produk Routes

Route.group(function () {
  Route.get("/", "ProdukController.index").as("produk.index");
  Route.post("/", "ProdukController.store")
    .middleware("office")
    .validator("Produk/CreateProduk")
    .as("produk.store");
  Route.put(":id", "ProdukController.update")
    .middleware("office")
    .validator("Produk/UpdateProduk")
    .as("produk.update");
  Route.get("/suggest", "ProdukController.suggest").as("produk.suggest");
  Route.get("/latest", "ProdukController.latestData").as("produk.latestData");
  Route.post("/import/:id", "ProdukController.importPekerjaan").middleware('office').as("produk.importPekerjaan");
  Route.put('/archive/:id', "ProdukController.postArchive").middleware('owner').as('produk.to_archive')
  Route.delete(':id', 'ProdukController.destroy').middleware('owner').as('produk.destroy')
})
  .prefix("api/product")
  .namespace("Produk")
  .middleware("jwt");
