'use strict'
const HttpService = use("HttpService");
const Transaksi = use("App/Models/Transaksi/Transaksi");
const PekerjaanPengeluaran = use("App/Models/Pekerjaan/Pengeluaran");
const { StatusCodes } = require('http-status-codes');

class LaporanController extends HttpService{
  constructor() {
    super();
  }

  async penjualan({ request, response }) {
    const req = request.all();

    /**
     * Request contain selected month and year
     * Default value is current month and year.
     *
     */
    const queryBuilder = Transaksi.query().where('status', 'received');
    if(req.month && req.year) {
      queryBuilder.whereRaw('(updated_at >= CAST(DATE_FORMAT("'+req.year+'-'+req.month+'-1" ,\'%Y-%m-01\') as DATE)) AND (updated_at <= LAST_DAY(DATE_FORMAT("'+req.year+'-'+req.month+'-1" ,\'%Y-%m-01\')))');
    } else {
      queryBuilder.whereRaw('(updated_at >= CAST(DATE_FORMAT(NOW() ,\'%Y-%m-01\') as DATE)) AND (updated_at <= LAST_DAY(DATE_FORMAT(NOW() ,\'%Y-%m-01\')))');
    }

    queryBuilder.orderBy('updated_at', 'desc');

    const data = await queryBuilder.fetch();
    // console.log(queryBuilder.query._statements);
    const dataJSON = data.toJSON();

    const _total = () => {
      let total = 0;
      for (let i = 0; i < dataJSON.length; i++) {
        total = total + dataJSON[i].jumlah_pembayaran
      }
      return total;
    }


    return this.payload({
      data,
      total: _total()
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async pengeluaran({ request, response }) {
    const req = request.all();
    /**
     * Request contain selected month and year
     * Default value is current month and year.
     *
     */

    const queryBuilder = PekerjaanPengeluaran.query();
    if(req.month && req.year) {
      queryBuilder.whereRaw('(updated_at >= CAST(DATE_FORMAT("'+req.year+'-'+req.month+'-1" ,\'%Y-%m-01\') as DATE)) AND (updated_at <= LAST_DAY(DATE_FORMAT("'+req.year+'-'+req.month+'-1" ,\'%Y-%m-01\')))');
    } else {
      queryBuilder.whereRaw('(updated_at >= CAST(DATE_FORMAT(NOW() ,\'%Y-%m-01\') as DATE)) AND (updated_at <= LAST_DAY(DATE_FORMAT(NOW() ,\'%Y-%m-01\')))');
    }

    queryBuilder.orderBy('updated_at', 'desc');

    const data = await queryBuilder.fetch();
    // console.log(queryBuilder.query._statements);
    const dataJSON = data.toJSON();

    const _total = () => {
      let total = 0;
      for (let i = 0; i < dataJSON.length; i++) {
        total = total + dataJSON[i].biaya
      }
      return total;
    }


    return this.payload({
      data,
      total: _total()
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }
}

module.exports = LaporanController
