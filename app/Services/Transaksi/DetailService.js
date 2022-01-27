const Database = use("Database");
const RollbackException = use("App/Exceptions/TransactionRollbackException");
const TransactionProceedException = use(
  "App/Exceptions/TransactionProceedException"
);
const Time = use("Time");
const Logger = use("Logger")

class TrxDetailService {
  single () {
    this._multiple = false;
    return this;
  }

  multiple () {
    this._multiple = true;
    return this;
  }

  async create (request, id) {
    if (this._multiple) {
      return await this.createMultiple(request, id);
    } else {
      return await this.createSingle(request, id);
    }
  }

  async createSingle (req, id) {
    /**
     * ID parameter is transaksi column
     *
     */
    const date = Time.currentTime();
    const trx = await Database.beginTransaction();
    try {
      const _detail = await trx
        .insert({
          transaksi: id,
          jenis: req.jenis,
          qty: req.qty,
          price: req.price,
          deskripsi: req.deskripsi,
          created_at: date,
          updated_at: date,
        })
        .into("transaksi_detail");

      const detail = JSON.parse(_detail);

      if (req.jenis == 0) {
        const produk = await trx.from('produk').where('id', req.produk).first();
        await trx.from('transaksi_detail').where('id', detail).update({
          updated_at: date,
          name: produk.name,
          cover: produk.cover
        })

        const gambar = await trx.from('produk_gambar').where('produk', req.produk);
        if (gambar.length > 0) {
          for (let i = 0; i < gambar.length; i++) {
            await trx.from('transaksi_detail_gambar').insert({
              transaksi_detail: detail,
              name: gambar[i].name,
              isAssets: true,
              created_at: date,
              updated_at: date
            });
          }
        }

        const spesifikasi = await trx
          .from("produk_spesifikasi")
          .where("produk", req.produk);

        if (spesifikasi.length > 0) {
          for (let index = 0; index < spesifikasi.length; index++) {
            await trx.from("transaksi_detail_spesifikasi").insert({
              transaksi_detail: detail,
              name: spesifikasi[index].name,
              value: spesifikasi[index].value,
              created_at: date,
              updated_at: date,
            });
          }
        }

        await trx
          .insert({
            transaksi_detail: detail,
            produk: req.produk,
            created_at: date,
            updated_at: date,
          })
          .into("transaksi_detail_produk");
      } else {
        await trx.from('transaksi_detail').where('id', detail).update({
          updated_at: date,
          name: req.name
        })
      }

      const transaksi = await trx.from("transaksi").where("id", id).first();

      await trx
        .from("transaksi")
        .where("id", id)
        .update({
          total_transaksi: transaksi.total_transaksi + (req.price * req.qty),
          updated_at: date,
        });

      await trx.commit();
      return true;
    } catch (error) {
      await trx.rollback();
      throw new RollbackException();
    }
  }

  async createMultiple (req, id) {
    for (let index = 0; index < req.length; index++) {
      await this.createSingle(req[index], id);
    }
  }

  async updateDetail (req, id) {
    /**
     * ID parameter is transaksi_detail column
     *
     */
    const date = Time.currentTime();
    const trx = await Database.beginTransaction();
    try {
      const detail = await trx.from("transaksi_detail").where("id", id).first();
      const transaksi = await trx
        .from("transaksi")
        .where("id", detail.transaksi)
        .first();

      if (!(['quotation', 'waiting_confirmation'].indexOf(transaksi.status.toLowerCase()) > -1)) {
        await trx.rollback();
        throw new TransactionProceedException();
      } else {
        const total_transaksi = transaksi.total_transaksi - (detail.price * detail.qty);

        await trx.from("transaksi_detail").where("id", detail.id).update({
          ...req,
          updated_at: date
        });

        const detail_final = await trx.from('transaksi_detail').where('id', detail.id).first();

        await trx
          .from("transaksi")
          .where("id", transaksi.id)
          .update({
            total_transaksi: total_transaksi + (detail_final.price * detail_final.qty),
            updated_at: date,
          });

        await trx.commit();
        return true;
      }
    } catch (error) {
      Logger.error('Detail Transaction Error', error)
      await trx.rollback();
      throw new RollbackException();
    }
  }

  async deleteDetail (id) {
    /**
     * ID parameter is transaksi_detail column
     *
     */
    const date = Time.currentTime();
    const trx = await Database.beginTransaction();
    try {
      const detail = await trx.from("transaksi_detail").where("id", id).first();
      const transaksi = await trx
        .from("transaksi")
        .where("id", detail.transaksi)
        .first();

      if ((transaksi.status == 'waiting_confirmation') || (transaksi.status == 'quotation')) {
        const calc = transaksi.total_transaksi - detail.qty * detail.price;
        await trx.from("transaksi").where("id", detail.transaksi).update({
          total_transaksi: calc,
          updated_at: date,
        });

        await trx.from("transaksi_detail").where("id", id).delete();

        await trx.commit();

        return {
          status: "success",
        };
      } else {
        await trx.rollback();
        return {
          status: "locked",
        };
      }
    } catch (error) {
      if (error.code === 'E_TRANSACTION_HAS_PROCEED') {
        await trx.rollback();
        throw new TransactionProceedException();
      } else {
        await trx.rollback();
        throw new RollbackException();
      }
    }
  }
}

module.exports = TrxDetailService;
