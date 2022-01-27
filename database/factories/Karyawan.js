const Factory = use("Factory");

Factory.blueprint("App/Models/Karyawan/Karyawan", async (faker, i, data) => {
  return {
    role: data.role ? data.role : 4,
    username: faker.username(),
    password: faker.password(),
    fullname: faker.name(),
    home_address: faker.address(),
    phone_number: faker.phone(),
    is_active: true,
  };
});
