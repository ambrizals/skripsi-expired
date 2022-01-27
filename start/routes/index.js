const Route = use("Route");

Route.get("/", () => {
  return null;
});
Route.post('/api/subscribe', 'MessenggerController.subscribe').middleware('jwt');
Route.get('/api/message', 'MessenggerController.generate').middleware('jwt');

require("./jwt");
require("./karyawan");
require("./product");
require("./material");
require("./pelanggan");
require("./transaksi");
require("./pekerjaan");
require("./tugas");
require("./pengiriman");
require('./laporan');
require('./dashboard');


