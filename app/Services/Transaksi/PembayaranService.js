const Database = use("Database");
const RollbackException = use("App/Exceptions/TransactionRollbackException");
const OverPaidException = use("App/Exceptions/OverPaidException");
const Time = use("Time");
const nexmo = use('App/Helpers/nexmo');
const fcm = use('App/Helpers/fcm');
const toRupiah = require('@develoka/angka-rupiah-js');
const Logger = use('Logger');

class PembayaranService {
  async makePayment (req, id, karyawan) {
    const sms = new nexmo();
    const date = Time.currentTime();
    const trx = await Database.beginTransaction();
    try {
      const transaksi = await trx.from("transaksi").where("id", id).first();
      const jumlahPembayaran = transaksi.jumlah_pembayaran + req.jumlah_pembayaran
      if (jumlahPembayaran > transaksi.total_transaksi) {
        throw new OverPaidException();
      } else {
        await trx.insert({
          transaksi: id,
          jumlah_pembayaran: req.jumlah_pembayaran,
          id_karyawan: karyawan.id,
          created_at: date,
          updated_at: date
        }).into('transaksi_pembayaran');

        await trx
          .from("transaksi")
          .where("id", id)
          .update({
            jumlah_pembayaran:
              transaksi.jumlah_pembayaran + req.jumlah_pembayaran,
            status: transaksi.status === 'quotation' ? 'waiting_confirmation' : transaksi.status,
            updated_at: date,
          });

        await trx.commit();

        fcm.post({
          title: 'Terdapat Transaksi Terbayar',
          body: 'Transaksi pada Nomor Invoice : ' + transaksi.no_transaksi + ' telah terbayar, harap periksa sebelum memproses pekerjaan.',
          type: 'transaksi',
          data: transaksi.id
        }, 'office')

        const smsMessage = 'Pembayaran pada Bang Bang Decor sebesar ' + toRupiah(req.jumlah_pembayaran, { floatingPoint: 0 }) + ' telah di terekam dengan nomor transakasi : ' + transaksi.no_transaksi + ' pada ' + date;
        sms.publish(smsMessage, transaksi.nomor_telepon);

        return true;
      }
    } catch (error) {
      await trx.rollback();
      if (error.code == 'E_REJECT_ALREADY_PAID') {
        throw new OverPaidException();
      } else {
        Logger.error(error.message, error);
        throw new RollbackException();
      }
    }
  }
}

module.exports = PembayaranService;
