const Supplier = use("App/Models/Material/Supplier");

class SupplierService {
  data(data) {
    // parameter may contain name, type, address and phone number
    this._data = data;
    return this;
  }

  quick(data) {
    // parameter only contain name
    this._data = {
      name: data,
    };
    return this;
  }

  async create() {
    return await Supplier.create(this._data);
  }

  async findByName(name) {
    return await Supplier.findByOrFail("name", name);
  }
}

module.exports = SupplierService;
