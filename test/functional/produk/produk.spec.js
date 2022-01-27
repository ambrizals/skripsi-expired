const faker = require("faker");

const { test, trait, before } = use("Test/Suite")("Product Test");
const Factory = use("Factory");

const AuthService = use("AuthService");

trait("Test/ApiClient");
trait("DatabaseTransactions");

let Auth;
let unsignedAuth;

let unsignedUser;
let fakeData;
let resultCheck;

const auth = new AuthService();

before(async () => {
  unsignedUser = await Factory.model("App/Models/Karyawan/Karyawan").create();
  await unsignedUser.merge({ role: 1 });
  await unsignedUser.save();

  Auth = await auth.createTest("bams");
  unsignedAuth = await auth.createTest(unsignedUser.toJSON().username);

  fakeData = await Factory.model("App/Models/Produk/Produk").create();
});

test("Make Product List Is Accessible !", async ({ client }) => {
  const response = await client
    .get("api/product")
    .header("X-AUTH-TOKEN", Auth.token)
    .end();
  response.assertStatus(200);
});

test("Make Product Suggest Is Accessible !", async ({ client }) => {
  const response = await client
    .get("api/product/suggest?searchName=tangan")
    .header("X-AUTH-TOKEN", Auth.token)
    .end();
  response.assertStatus(200);
});

test("Make a new product", async ({ client }) => {
  const response = await client
    .post("api/product")
    .header("X-AUTH-TOKEN", Auth.token)
    .send({
      name: faker.random.word(),
      price: 650000,
    })
    .end();
  response.assertStatus(200);
});

test("Restriction for non office employee", async ({ client }) => {
  const response = await client
    .post("api/product")
    .header("X-AUTH-TOKEN", unsignedAuth.token)
    .send({
      name: faker.random.word(),
      price: 650000,
    })
    .end();
  response.assertStatus(401);
});

test("Update Product", async ({ client }) => {
  const _fakeData = fakeData.toJSON();

  const response = await client
    .put("api/product/" + _fakeData.id)
    .header("X-AUTH-TOKEN", Auth.token)
    .send({
      name: faker.random.word(),
      price: 500000,
    })
    .end();

  response.assertStatus(200);
});

test("Check latest product data", async ({ client, assert }) => {
  const response = await client
    .get("api/product/latest")
    .header("X-AUTH-TOKEN", Auth.token)
    .end();

  const result = JSON.parse(response.text);
  assert.exists(result.payload.created_at);
  assert.exists(result.payload.updated_at);
  response.assertStatus(200);

  resultCheck = {
    created_at: result.payload.created_at,
    updated_at: result.payload.updated_at,
  };
});

test("Grab only new data", async ({ client }) => {
  const response = await client
    .get(
      "api/product?createdAtCheck=" +
      resultCheck.created_at +
      "?updatedAtCheck=" +
      resultCheck.updated_at
    )
    .header("X-AUTH-TOKEN", Auth.token)
    .end();

  response.assertStatus(200);
});

test("Only owner can archiving a product", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client.put('api/product/archive/' + _fakeData.id)
    .header('X-AUTH-TOKEN', unsignedAuth.token)
    .end();

  response.assertStatus(401);
})

test("archiving a product", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client.put('api/product/archive/' + _fakeData.id)
    .header('X-AUTH-TOKEN', Auth.token)
    .end();

  response.assertStatus(200);
})

test("Deleting a product", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client.delete('api/product/' + _fakeData.id)
    .header('X-AUTH-TOKEN', Auth.token)
    .end();

  response.assertStatus(200);
})
