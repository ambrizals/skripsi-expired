const Pelanggan = use("App/Models/Pelanggan");

class PelangganService {
  async findByName(name) {
    return await Pelanggan.findByOrFail("name", name);
  }

  async create(payload) {
    // Make sure payload is json format
    return await Pelanggan.create(payload);
  }

  paginate(page, limit) {
    this._paginate = { page, limit };
    return this;
  }

  fetch() {
    this._fetch = true;
    return this;
  }

  async get(req) {
    const queryBuilder = Pelanggan.query();

    req.searchName
      ? queryBuilder.where("name", "like", "%" + req.searchName + "%")
      : null;

    req.sortDate == "true"
      ? queryBuilder.orderBy("created_at", "asc")
      : queryBuilder.orderBy("created_at", "desc");

    if (this._paginate) {
      return await queryBuilder.paginate(this._paginate.page, this._paginate.limit);
    } else if (this._fetch) {
      return await queryBuilder.fetch();
    }
  }
}

module.exports = PelangganService;
