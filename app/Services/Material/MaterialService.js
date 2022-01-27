const Supplier = require("./SupplierService");

const Material = use("App/Models/Material/Material");

class MaterialService {
  constructor() {
    this.supplier = new Supplier();
  }

  id(id) {
    this._id = id;
    return this;
  }

  async getID(name) {
    const _supplier = await this.supplier.findByName(name);
    const supplier = await _supplier.toJSON();
    this._id = supplier.id;

    return this;
  }

  async create(payload) {
    // Payload must retrive request.all() or something like that.
    await this.getID(payload.supplier);
    payload = {
      ...payload,
      supplier: this._id,
    };
    // console.log(payload);
    return await Material.create(payload);
  }

  async update(payload) {
    // Payload must retrive request.all()
    const data = await Material.findOrFail(this._id);
    await data.merge(payload);
    return await data.save();
  }
}

module.exports = MaterialService;
