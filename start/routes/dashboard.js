const Route = use("Route");


Route.group(function () {
  Route.get('tugas', 'OutfieldController.tugas').as('dashboard.outfield.tugas');
  Route.get('transaksi', 'OfficeController.transaksi').as('dashboard.office.transaksi').middleware('office');
  Route.get('pekerjaan', 'OfficeController.pekerjaan').as('dashboard.office.pekerjaan').middleware('office');
  Route.get('pengirimanCount', 'OfficeController.pengirimanCount').as('dashboard.office.pengirimanCount').middleware('office');
  Route.get('transaksiCount', 'OfficeController.transaksiCount').as('dashboard.office.transaksiCount').middleware('office');
  Route.get('pekerjaanCount', 'OfficeController.pekerjaanCount').as('dashboard.office.pekerjaanCount').middleware('office');
})
  .prefix("api/dashboard")
  .namespace('Dashboard')
  .middleware(["jwt"]);
