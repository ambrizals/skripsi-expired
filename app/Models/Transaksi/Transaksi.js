"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { arabToRoman } = require("roman-numbers");
const Env = use("Env");

class Transaksi extends Model {
  static get table () {
    return "transaksi";
  }

  static boot () {
    super.boot();
    const date = new Date();
    let _noTransaksi;

    const noTransaksi = async () => {
      const _queryBuilder = this.query();

      if (Env.get("DB_CONNECTION") !== "sqlite") {
        _queryBuilder.whereRaw(
          "created_at > CURDATE() AND created_at < CURDATE() + INTERVAL 1 day"
        );
      } else {
        _queryBuilder.whereRaw(
          "created_at between datetime('now') and datetime('now', '+1 day')"
        );
      }
      const _data = await _queryBuilder.getCount();
      return _data + 1;
    };

    this.addHook("beforeCreate", async (instance) => {
      _noTransaksi = await noTransaksi();
      instance.no_transaksi =
        "INV/BBD/" +
        date.getDate() +
        "/" +
        arabToRoman(date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        "/" +
        _noTransaksi;
    });

    this.addHook("afterCreate", async (instance) => {
      instance.no_transaksi =
        "INV/BBD/" +
        date.getDate() +
        "/" +
        arabToRoman(date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        "/" +
        _noTransaksi;
    });
  }

  Karyawan () {
    return this.belongsTo("App/Models/Karyawan/Karyawan", "karyawan", "id");
  }

  Pelanggan () {
    return this.belongsTo("App/Models/Pelanggan", "pelanggan", "id");
  }

  Pembayaran () {
    return this.hasMany("App/Models/Transaksi/Pembayaran", "id", "transaksi");
  }
}

module.exports = Transaksi;
