const Time = use("Time");

class MaterialCreator {
  constructor() {
    this.date = Time.currentTime();
  }

  async createSupplier(trx, payload) {
    let supplier;
    const _supplier = await trx.from('supplier').where('name', payload.supplier).first();
    if (_supplier) {
      supplier = _supplier.id
    } else {
      const supplierQuery = await trx.insert({
        name: payload.supplier,
        created_at: this.date,
        updated_at: this.date
      }).into('supplier');
      supplier = supplierQuery[0]
    }
    return supplier;
  }

  async createMaterial(trx, payload, supplier) {
    let material;

    const _material = await trx.from('material').where('supplier', supplier).where('name', payload.name).first();

    if (_material) {
      await trx.from('material').where('id', _material.id).update({
        price: payload.price,
        satuan: payload.satuan,
        updated_at: this.date
      })
      material = _material.id
    } else {
      const materialQuery = await trx.insert({
        name: payload.name,
        price: payload.price,
        satuan: payload.satuan,
        supplier: supplier,
        created_at: this.date,
        updated_at: this.date
      }).into('material');
      material = materialQuery[0]
    }

    return material;
  }

  async createPekerjaanMaterial(trx, payload, pekerjaan, user, request) {
    const requestBy = () => {
      if(request) {
        return true;
      } else {
        return false
      }
    }

    let pekerjaanMaterial;

    const _pekerjaanMaterial = await trx.from('pekerjaan_material').where('name', payload.name).where('pekerjaan', pekerjaan).first();
    if (_pekerjaanMaterial) {
      await trx.from('pekerjaan_material').where('id', _pekerjaanMaterial.id).update({
        updated_at: this.date,
        qty: parseInt(_pekerjaanMaterial.qty) + parseInt(payload.qty)
      })
      pekerjaanMaterial = _pekerjaanMaterial.id
    } else {
      const pekerjaanMaterialQuery = await trx.insert({
        pekerjaan: pekerjaan,
        karyawan: user.id,
        name: payload.name,
        qty: payload.qty,
        satuan: payload.satuan,
        created_at: this.date,
        updated_at: this.date,
        isRequest: requestBy()
      }).into('pekerjaan_material')
      pekerjaanMaterial = pekerjaanMaterialQuery[0]

      if(requestBy()) {
        await trx.from('pekerjaan_permintaan_material').where('id', request.id).update({
          isAccept: true
        });
      }

    }

    return pekerjaanMaterial;
  }

  async createPengeluaran(trx, pekerjaan, user, catatan, payload) {
    const pengeluaran = await trx.from("pekerjaan_pengeluaran").insert({
      pekerjaan: pekerjaan,
      karyawan: user.id,
      name: `Pembelian material ${payload.name} di ${payload.supplier} sejumlah ${payload.qty} ${payload.satuan}`,
      biaya: payload.qty * payload.price,
      isMaterial: true,
      created_at: this.date,
      updated_at: this.date,
    });

    const link = await trx.from("pekerjaan_material_pengeluaran").insert({
      pekerjaan_material: catatan.pekerjaanMaterial,
      pekerjaan_pengeluaran: pengeluaran,
      material: catatan.material,
      qty: payload.qty,
      price: payload.price,
      created_at: this.date,
      updated_at: this.date,
    });  
    return link[0];  
  }

  async updateLinkRequest(trx, link, request) {
    await trx.from('pekerjaan_material_pengeluaran').where('id', link).update({
      permintaan: request
    });
  }
}

module.exports = MaterialCreator;
