"use strict";

const { StatusCodes } = require("http-status-codes");

const HttpService = use("HttpService");
const AuthService = use("AuthService");

const Pengiriman = use("App/Models/Pengiriman");
const Transaksi = use("App/Models/Transaksi/Transaksi");
const Pagination = use("Pagination");
const Database = use("Database");
const Time = use("Time");
const RollbackException = use("App/Exceptions/TransactionRollbackException");
const NotFullPaidTransactionException = use("App/Exceptions/NotFullPaidTransactionException");
const nexmo = use('App/Helpers/nexmo');
const fcm = use('App/Helpers/fcm');


class PengirimanController extends HttpService {
  constructor() {
    super();
    this.authService = new AuthService();
  }

  async index ({ request, response }) {
    const req = request.all();
    const { page, limit } = Pagination.create(req);

    const queryBuilder = Pengiriman.query().with('Transaksi').with('Pengirim');

    switch (req.status) {
      case 0:
        queryBuilder.where('status', 0)
        break;
      case 1:
        queryBuilder.where("status", 1);
        break;
      case 2:
        queryBuilder.where("status", 2);
        break;
      default:
        break;
    }

    req.sortDate === "true"
      ? queryBuilder.orderBy("created_at", "asc")
      : queryBuilder.orderBy("created_at", "desc");

    if(req.searchName) queryBuilder.where('penerima', 'like', `%${req.searchName}%`)

    const data = await queryBuilder.paginate(page, limit);

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async transaksi ({ request, response }) {
    const transaksi = await Transaksi.query().where('status', 'waiting_shipping').fetch();
    return this.payload(transaksi)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async userTask ({ request, response }) {
    const header = request.headers();
    const queryBuilder = Pengiriman.query();
    const karyawan = await this.authService.getUser(header["x-auth-token"]);

    const data = await queryBuilder.with('Transaksi').where('status', 0).where('pengirim', karyawan.id).fetch();
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store ({ request, response, params }) {
    /**
     *
     * Only contain transaksi ID and sender (karyawan) to process
     *
     */
    const req = request.all();
    const date = Time.currentTime();
    const transaksi = await Transaksi.findOrFail(params.id);
    const sms = new nexmo();

    if (transaksi.status !== 'waiting_shipping') {
      return this.payload({
        message: "Pesanan pada transaksi ini belum siap dikirim",
      })
        .request(request)
        .status(StatusCodes.LOCKED)
        .res(response);
    } else {
      const trx = await Database.beginTransaction();
      try {
        const smsMessage = 'Pesanan anda pada nomor transaksi : ' + transaksi.no_transaksi + ' akan segera dikirim, hubungi tim bang bang decor di nomor 081153499970 untuk lebih lanjut.'

        sms.publish(smsMessage, transaksi.nomor_telepon);

        const pengiriman = await trx.from("pengiriman").insert({
          transaksi: params.id,
          pengirim: req.pengirim,
          created_at: date,
          updated_at: date,
          penerima: transaksi.penerima
        });

        await trx.from("transaksi").where("id", params.id).update({
          status: 'on_shipping',
          updated_at: date,
        });

        await trx.commit();

        fcm.post({
          title: 'Ada tugas pengiriman baru!',
          body: 'Hai kamu ditugaskan untuk melakukan pengiriman.',
          type: 'pengiriman',
          data: pengiriman.id
        }, `user-${req.pengirim}`)

        return this.payload({
          message: "Data pengiriman telah diproses",
          pengiriman: JSON.parse(pengiriman),
        })
          .request(request)
          .status(StatusCodes.OK)
          .res(response);
      } catch (error) {
        await trx.rollback();
        throw new RollbackException();
      }
    }
  }

  async updatePengirim ({ request, response, params }) {
    const req = request.all();
    const pengiriman = await Pengiriman.findOrFail(params.id);
    fcm.post({
      title: 'Perintah pengiriman mu telah dibatalkan',
      body: 'Hai, ada perintah pengiriman yang telah dibatalkan.',
      type: 'pengiriman',
      data: pengiriman.id
    }, `user-${pengiriman.pengirim}`)
    
    pengiriman.pengirim = req.pengirim;
    await pengiriman.save();

    fcm.post({
      title: 'Ada tugas pengiriman baru!',
      body: 'Hai kamu ditugaskan untuk melakukan pengiriman.',
      type: 'pengiriman',
      data: pengiriman.id
    }, `user-${req.pengirim}`)


    return this.payload({
      message: 'Data pengirim sudah diubah !'
    }).request(request).status(StatusCodes.OK).res(response);
  }

  async show ({ request, response, params }) {
    const pengiriman = await Pengiriman.findOrFail(params.id);
    const pengirim = await pengiriman.Pengirim().first();

    return this.payload({
      pengiriman,
      pengirim,
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async markFinish ({ request, response, params }) {
    /**
     *
     * Only include receiver data.
     *
     */
    const req = request.all();
    const date = Time.currentTime();

    const _pengiriman = await Pengiriman.findOrFail(params.id);
    const pengiriman = _pengiriman.toJSON();
    const trx = await Database.beginTransaction();

    try {
      const transaksi = await trx.from('transaksi').where('id', pengiriman.transaksi).first();
      if (transaksi.total_transaksi !== transaksi.jumlah_pembayaran) {
        throw new NotFullPaidTransactionException();
      } else {
        await trx.from("pengiriman").where("id", pengiriman.id).update({
          penerima: req.penerima,
          status: 1,
          updated_at: date,
        });

        await trx.from("transaksi").where("id", pengiriman.transaksi).update({
          status: 'received',
          updated_at: date,
        });

        await trx.commit();
        fcm.post({
          title: 'Pesanan Telah Terkirim',
          body: 'Pesanan pada nomor transaksi : ' + transaksi.no_transaksi + ' telah terkirim.',
          type: 'pengiriman',
          data: transaksi.id
        }, 'office')
        return this.payload({
          message: "Pengiriman telah diselesaikan",
        })
          .request(request)
          .status(StatusCodes.OK)
          .res(response);
      }
    } catch (error) {
      await trx.rollback();
      if (error.code === 'E_REJECT_COMPLETION_SHIPMENT') {
        throw new NotFullPaidTransactionException();
      } else {
        throw new RollbackException();
      }
    }
  }
}

module.exports = PengirimanController;
