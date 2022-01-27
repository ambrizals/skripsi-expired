const faker = require("faker");

const Factory = use("Factory");

const { test, trait, before, after } = use("Test/Suite")("Pelanggan Test");

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");
trait("DatabaseTransactions");

let office;
let outfield;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();
  fakeData = await Factory.model("App/Models/Pelanggan").create();
});

test("Make sure customer list is accessible", async ({ client }) => {
  const response = await client
    .get("api/pelanggan")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  response.assertStatus(200);
});

test("Make sure customer suggest is accessible", async ({ client, assert }) => {
  const _fakeData = fakeData.toJSON();
  
  const fetch_suggest = await client
    .get("api/pelanggan/suggest")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  fetch_suggest.assertStatus(200);
  assert.notEqual(fetch_suggest.body.payload.length, 0)

  const fetch_suggest_search = await client
    .get(`api/pelanggan/suggest?searchName=${_fakeData.name}`)
    .header('X-AUTH-TOKEN', office.token)
    .end()

  fetch_suggest_search.assertStatus(200)
  assert.notEqual(fetch_suggest_search.body.payload.length, 0)
  assert.equal(fetch_suggest_search.body.payload[0].name, _fakeData.name)
});

test("Create customer data", async ({ client }) => {
  const response = await client
    .post("api/pelanggan")
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      name: faker.name.firstName(),
      address: faker.address.streetAddress(),
      phone: faker.phone.phoneNumberFormat(),
    })
    .end();

  response.assertStatus(200);
});

test("Make sure outfield can't update customer data", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .put("api/pelanggan/" + _fakeData.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      address: faker.address.streetAddress(),
    })
    .end();

  response.assertStatus(401);
});

test("Make sure office can update customer data", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .put("api/pelanggan/" + _fakeData.id)
    .header("X-AUTH-TOKEN", office.token)
    .send({
      address: faker.address.streetAddress(),
    })
    .end();

  response.assertStatus(200);
});
