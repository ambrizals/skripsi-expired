const faker = require("faker");

const Factory = use("Factory");

const { test, trait, before } = use("Test/Suite")("Supplier Material Test");

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");
trait("DatabaseTransactions");

let office;
let outfield;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();

  fakeData = await Factory.model("App/Models/Material/Supplier").create();
});

test("Make sure supplier list is accessible", async ({ client }) => {
  const response = await client
    .get("api/material/supplier")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(200);
});

test("Make sure outfield can't create supplier", async ({ client }) => {
  const response = await client
    .post("api/material/supplier")
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      name: faker.random.word(),
      type: faker.random.word(),
      address: faker.address.streetName(),
      phone: faker.phone.phoneNumberFormat(),
    })
    .end();

  response.assertStatus(401);
});

test("Make sure office can create supplier", async ({ client }) => {
  const response = await client
    .post("api/material/supplier")
    .header("X-AUTH-TOKEN", office.token)
    .send({
      name: faker.random.word(),
      type: faker.random.word(),
      address: faker.address.streetName(),
      phone: faker.phone.phoneNumberFormat(),
    })
    .end();

  response.assertStatus(200);
});

test("Make sure supplier detail is accessible", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .get("api/material/supplier/" + _fakeData.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();

  response.assertStatus(200);
});

test("Make sure outfield can't update supplier data", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .put("api/material/supplier/" + _fakeData.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      type: faker.random.word(),
      phone: faker.phone.phoneNumberFormat(),
    })
    .end();

  response.assertStatus(401);
});

test("Make sure office can update supplier data", async ({ client }) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .put("api/material/supplier/" + _fakeData.id)
    .header("X-AUTH-TOKEN", office.token)
    .send({
      type: faker.random.word(),
      phone: faker.phone.phoneNumberFormat(),
    })
    .end();

  response.assertStatus(200);
});

test("Make sure supplier suggest is work", async({ client, assert }) => {
  const _fakeData = fakeData.toJSON();
  const fetch_suggest = await client.get('api/material/supplier/suggest')
    .header('X-AUTH-TOKEN', office.token)
    .end();

  fetch_suggest.assertStatus(200);
  assert.notEqual(fetch_suggest.body.payload.length, 0)

  const fetch_suggest_search = await client
    .get(`api/material/supplier/suggest?searchName=${_fakeData.name}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();

  fetch_suggest_search.assertStatus(200);
  assert.equal(fetch_suggest_search.body.payload[0].name, _fakeData.name)
  assert.notEqual(fetch_suggest.body.payload.length, 0)
})
