const TransaksiDetail = use("App/Models/Transaksi/Detail");
const Transaksi = use("App/Models/Transaksi/Transaksi");
const Database = use("Database");
const RollbackException = use("App/Exceptions/TransactionRollbackException");
const PekerjaanCreatorException = use(
  "App/Exceptions/PekerjaanCreatorException"
);
const Time = use("Time");
const fcm = use('App/Helpers/fcm');
const Logger = use("Logger")

class PekerjaanCreator {
  async transaksi (id) {
    const date = Time.currentTime();
    const transaksi = await Transaksi.findOrFail(id);

    if (transaksi.status !== 'waiting_confirmation') {
      throw new PekerjaanCreatorException();
    } else {
      const data = await TransaksiDetail.query()
        .where("transaksi", id)
        .fetch();
      this._detail = data.toJSON();

      const trx = await Database.beginTransaction();

      try {
        await trx.from("transaksi").where("id", id).update({
          updated_at: date,
          status: 'on_process',
        });

        await trx.commit();
        fcm.post({
          title: 'Terdapat Pekerjaan Baru',
          body: 'Transaksi pada Nomor Invoice : ' + transaksi.no_transaksi + ' telah diproses, siapkan tugas baru untuk membuat perintah kerja.',
          type: 'pekerjaan-creator',
          data: transaksi.id
        }, 'office')
      } catch (error) {
        Logger.error('Pekerjaan Creator Error', error)
        await trx.rollback();
        throw new RollbackException();
      }
    }
    return this;
  }

  async create (karyawan) {
    const date = Time.currentTime();

    const data = this._detail;
    const trx = await Database.beginTransaction();
    try {
      for (let index = 0; index < data.length; index++) {
        await trx.from('transaksi_detail').where('id', data[index].id).update({
          status: 'pending',
          updated_at: date
        });

        await trx
          .insert({
            transaksi_detail: data[index].id,
            name: data[index].name,
            catatan: data[index].deskripsi,
            created_by: karyawan.id,
            created_at: date,
            updated_at: date,
          })
          .into("pekerjaan");
      }
      await trx.commit();
      return true;
    } catch (error) {
      if (error.code = 'E_PEKERJAAN_CONFLICT') {
        await trx.rollback();
        throw new PekerjaanCreatorException();
      } else {
        Logger.error('Pekerjaan Creator Error', error)
        await trx.rollback();
        throw new RollbackException();
      }
    }
  }
}

module.exports = PekerjaanCreator;
