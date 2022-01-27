const Time = use("Time");
const Pekerjaan = use("App/Models/Pekerjaan");
const Database = use("Database");
const fcm = use('App/Helpers/fcm');
const Logger = use("Logger")

const RollbackException = use("App/Exceptions/TransactionRollbackException");

class FinishAction {
  async create (pekerjaan, detailTransaksi) {
    const date = Time.currentTime();
    const trx = await Database.beginTransaction();
    try {
      // Update transaction detail
      await trx
        .from("transaksi_detail")
        .where("id", pekerjaan.transaksi_detail)
        .update({
          status: 'finish',
          updated_at: date,
        });

      // Fetch required data to check finish item on related transaction
      const listDetail = await trx.from('transaksi_detail').where('transaksi', detailTransaksi.transaksi);
      const listFinish = await trx.from('transaksi_detail').where('transaksi', detailTransaksi.transaksi).where('status', 'finish');

      if (listDetail.length === listFinish.length) {
        await trx
          .from("transaksi")
          .where("id", detailTransaksi.transaksi)
          .update({
            status: 'waiting_shipping',
            updated_at: date,
          });

        const _transaksiData = await trx.from('transaksi').where('id', detailTransaksi.transaksi).first();

        fcm.post({
          title: 'Transaksi Selesai Diproses',
          body: 'Seluruh pesanan pada transaksi pada Nomor Invoice : ' + _transaksiData.no_transaksi + ' telah selesai.',
          type: 'transaksi',
          data: _transaksiData.id
        }, 'office')
      }

      await trx.commit();
      return true;

    } catch (error) {
      Logger.error('Finish Action', error)
      await trx.rollback();
      throw new RollbackException();
    }
  }
}

module.exports = FinishAction;
