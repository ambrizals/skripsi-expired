const Tugas = use("App/Models/Tugas");
const Database = use("Database");
const Time = use("Time");
const fcm = use('App/Helpers/fcm');
const Logger = use("Logger")

const RollbackException = use("App/Exceptions/TransactionRollbackException");

class checkCreator {
  async create(req, auth, id) {
    const date = Time.currentTime();
    const tugas = await Tugas.findOrFail(id);
    const calc = req.qty + tugas.jumlah_selesai;

    if (calc > tugas.target_selesai) {
      return {
        status: "overload",
      };
    } else {
      const trx = await Database.beginTransaction();
      try {
        await trx.from("tugas_karyawan").insert({
          tugas: id,
          karyawan: req.karyawan || auth.id,
          jumlah_selesai: req.qty,
          created_by: auth.id,
          pekerjaan: tugas.pekerjaan,
          created_at: date,
          updated_at: date,
        });

        const statusTugas = () => {
          if (calc === tugas.target_selesai) {
            return true;
          } else {
            return false;
          }
        };

        await trx.from("tugas").where("id", id).update({
          jumlah_selesai: calc,
          isFinish: statusTugas(),
          updated_at: date,
        });

        const listFinish = await trx
          .from("tugas")
          .where("pekerjaan", tugas.pekerjaan)
          .where("isFinish", true);

        const listTugas = await trx
          .from("tugas")
          .where("pekerjaan", tugas.pekerjaan);

        if (listFinish.length === listTugas.length) {
          await trx
            .from("pekerjaan")
            .where("id", listFinish[0].pekerjaan)
            .update({
              isReady: true,
              updated_at: date
            });
          fcm.post({
            title: 'Ada tugas yang diselesaikan',
            body: 'Silahkan cek tugas tersebut sebelum diproses ke tugas selanjutnya.',
            type: 'pekerjaan',
            data: tugas.pekerjaan
          }, 'office')
        }

        await trx.commit();
        return {
          status: "success",
        };
      } catch (error) {
        Logger.error("Tugas Check Error", error)
        await trx.rollback();
        throw new RollbackException();
      }
    }
  }
}

module.exports = checkCreator;
