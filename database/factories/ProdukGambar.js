const Factory = use("Factory");

Factory.blueprint("App/Models/Produk/Gambar", async (faker) => {
  return {
    produk: 1,
    name: faker.apple_token() + ".jpg",
  };
});
