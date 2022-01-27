const faker = require("faker");

const Factory = use("Factory");

const { test, trait, before } = use("Test/Suite")("Product Spesification Test");

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");
trait("DatabaseTransactions");

let office;
let outfield;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();

  fakeData = await Factory.model("App/Models/Produk/Spesifikasi").create();
});

test("Make sure specification on Product ID 1 is accessible ", async ({
  client,
}) => {
  const response = await client
    .get("/api/product/specs/1")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(200);
});

test("Create Spesification on Product ID 1", async ({ client }) => {
  const response = await client
    .post("api/product/specs/1")
    .header("X-AUTH-TOKEN", office.token)
    .send({
      name: faker.random.word(),
      value: faker.random.word(),
    })
    .end();

  response.assertStatus(200);
});

test("Restriction access for non office employee", async ({ client }) => {
  const response = await client
    .post("api/product/specs/1")
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      name: faker.random.word(),
      value: faker.random.word(),
    })
    .end();

  response.assertStatus(401);
});

test("Update Spesification Data", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .put("api/product/specs/" + _fakeData.id)
    .header("X-AUTH-TOKEN", office.token)
    .send({
      name: _fakeData.name,
      value: faker.random.word(),
    })
    .end();

  response.assertStatus(200);
});

test("Show Detail Product ID 1 Spesification", async ({ client }) => {
  const response = await client
    .get("api/product/specs/1/detail")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(200);
});
