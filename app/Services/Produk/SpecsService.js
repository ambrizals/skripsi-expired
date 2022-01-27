const Specs = use("App/Models/Produk/Spesifikasi");

class SpecProdukService {
  product(id) {
    this._id = id;
    return this;
  }

  data(prd) {
    this._data = [
      {
        produk: this._id,
        name: prd.name,
        value: prd.value,
      },
    ];

    return this;
  }

  multiple(prd) {
    let data = [];
    prd.forEach((item) => {
      data.push({
        produk: this._id,
        name: item.name,
        value: item.value,
      });
    });

    this._data = data;
    return this;
  }

  // Final method
  async create() {
    return await Specs.createMany(this._data);
  }
}

module.exports = SpecProdukService;
