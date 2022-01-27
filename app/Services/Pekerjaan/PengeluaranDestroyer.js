const Database = use("Database");
const RollbackException = use("App/Exceptions/TransactionRollbackException");
const Time = use("Time");

class PengeluaranDestroyer {
  async execute(id) {
    const date = Time.currentTime();

    const trx = await Database.beginTransaction();

    try {
      const pengeluaran = await trx
        .from("pekerjaan_pengeluaran")
        .where("id", id)
        .first();

      if (pengeluaran.isMaterial) {
        const hub = await trx
          .from("pekerjaan_material_pengeluaran")
          .where("pekerjaan_pengeluaran", id)
          .first();
        const material = await trx
          .from("pekerjaan_material")
          .where("id", hub.pekerjaan_material)
          .first();

        const calcQty = material.qty - hub.qty;
        await trx
          .from("pekerjaan_material_pengeluaran")
          .where("id", hub.id)
          .delete();

        if (material.isRequest === 1) {
          await trx.from('pekerjaan_permintaan_material').where('id', hub.permintaan).delete();
        }
        if (calcQty <= 0) {
          await trx
            .from("pekerjaan_material")
            .where("id", material.id)
            .delete();
        } else {
          await trx.from("pekerjaan_material").where("id", material.id).update({
            qty: calcQty,
            updated_at: date,
          });
        }
      }

      await trx.from("pekerjaan_pengeluaran").where("id", id).delete();

      await trx.commit();
      return true;
    } catch (error) {
      console.log(error);
      await trx.rollback();
      throw new RollbackException();
    }
  }
}

module.exports = PengeluaranDestroyer;
