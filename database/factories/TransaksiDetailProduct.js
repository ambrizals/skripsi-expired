const Factory = use("Factory");

Factory.blueprint(
  "App/Models/Transaksi/Detail/Product",
  async (faker, i, data) => {
    return {
      produk: data.produk || 1,
    };
  }
);
