const Database = use("Database");
const RollbackException = use("App/Exceptions/TransactionRollbackException");
const Time = use("Time");
const Logger = use("Logger");
const fcm = use('App/Helpers/fcm');

class TugasDestroyer {
  constructor() {
    this.date = Time.currentTime();
  }

  async deleteTugas(tugas) {
    const trx = await Database.beginTransaction();

    try {
      const listTugas = await trx.from('tugas').where('pekerjaan', tugas.pekerjaan);
      let finishCounter = 0;
      let unfinishCounter = 0;
      
      for (let index = 0; index < listTugas.length; index++) {
        if((listTugas[index].isFinish === 1) && (listTugas[index].id !== tugas.id)) {
          finishCounter = ++finishCounter
        } else if ((listTugas[index].isFinish === 0) && (listTugas[index].id !== tugas.id)) {
          unfinishCounter = ++unfinishCounter
        }
      }

      const flagFinish = () => {
        if(finishCounter <= unfinishCounter) {
          return false;
        } else {
          return true;
        }
      }

      await trx.from('pekerjaan').where('id', tugas.pekerjaan).update({
        updated_at: this.date,
        isReady: flagFinish()
      })
      
      const history = await trx.from('tugas_karyawan').where('tugas', tugas.id).limit(1);
      if (history.length > 0) {
        await trx.from('tugas').where('id', tugas.id).update({
          isDelete: true,
          updated_at: this.date
        });
      } else {
        await trx.from('tugas').where('id', tugas.id).delete();
      }
      
      await trx.commit();
    } catch(err) {
      Logger.error('Tugas Destroyer Exception on Delete Tugas', err);
      await trx.rollback();
      throw new RollbackException();
    }
  }

  async revokeHistory(history, req, user) {
    const trx = await Database.beginTransaction();
    try {
      await trx.from('tugas_karyawan').where('id', history.id).update({
        updated_at: this.date,
        isCancel: true,
        catatan: req.catatan,
        revokeBy: user.id,
      })

      const tugasKaryawan = await trx.from('tugas_karyawan').where('id', history.id).first();

      const tugas = await trx.from('tugas').where('id', history.tugas).first();
      

      await trx.from('tugas').where('id', history.tugas).update({
        updated_at: this.date,
        jumlah_selesai: parseInt(tugas.jumlah_selesai) - parseInt(history.jumlah_selesai),
        isFinish: false
      })

      await trx.from('pekerjaan').where('id', history.pekerjaan).update({
        updated_at: this.date,
        isReady: false
      })


      fcm.post({
        title: 'Hasil Tugasmu Ditolak',
        body: `Tugas ${tugas.name} yang kamu kerjakan ditolak karena ${req.catatan}`,
        type: 'tugas',
        data: tugas.id
      }, `user-${tugasKaryawan.karyawan}`)      
      
      await trx.commit();
    } catch(err) {
      Logger.error('Tugas Destroyer Exception on Revoke Tugas', err);
      await trx.rollback();
      throw new RollbackException();
    }
  }
}

module.exports = TugasDestroyer;