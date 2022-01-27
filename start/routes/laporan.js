const Route = use("Route");


Route.group(function () {
  Route.post('penjualan', 'LaporanController.penjualan').as('laporan.penjualan');
  Route.post('pengeluaran', 'LaporanController.pengeluaran').as('laporan.pengeluaran');
})
  .prefix("api/laporan")
  .middleware(["jwt", "office"]);
