const Produk = use("App/Models/Produk/Produk");

class ProductService {
  paginate (page, limit) {
    this._paginate = { page, limit };
    return this;
  }

  fetch () {
    this._fetch = true;
    return this;
  }

  async get (req, archive) {
    const queryBuilder = Produk.query();

    if (req.searchName)
      queryBuilder.where("name", "like", "%" + req.searchName + "%");

    if (req.createdAtCheck)
      queryBuilder.where("created_at", ">=", req.createdAtCheck);

    if (req.updatedAtCheck)
      queryBuilder.where("created_at", ">=", req.updatedAtCheck);

    if (req.sortPrice == 'higher') {
      queryBuilder.orderBy("price", "desc")
    } else if (req.sortPrice == 'lower') {
      queryBuilder.orderBy("price", "asc")
    }

    req.sortDate
      ? queryBuilder.orderBy("created_at", "asc")
      : queryBuilder.orderBy("created_at", "desc");

    archive == "true"
      ? queryBuilder.where('is_archive', true)
      : queryBuilder.where('is_archive', false)

    if (this._paginate) {
      return await queryBuilder.paginate(this._paginate.page, this._paginate.limit);
    } else if (this._fetch) {
      return await queryBuilder.fetch();
    }
  }
}

module.exports = ProductService;
