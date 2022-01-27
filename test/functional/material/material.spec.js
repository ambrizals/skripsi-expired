const faker = require("faker");

const Factory = use("Factory");

const { test, trait, before } = use("Test/Suite")("Material Test");

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");

let office;
let outfield;
let fakeMaterial;
let fakeSupplier;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();

  const _fakeSupplier = await Factory.model("App/Models/Material/Supplier").create();
  fakeSupplier = _fakeSupplier.toJSON();
  
  const _fakeMaterial = await Factory.model("App/Models/Material/Material").create({
    supplier: fakeSupplier.id
  })

  fakeMaterial = _fakeMaterial.toJSON();
});

test("Make sure material list is accessible", async ({ client }) => {
  const response = await client
    .get("api/material")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  response.assertStatus(200);
});

test("Make sure outfield can't create material data", async ({ client }) => {
  const response = await client
    .post("api/material")
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      supplier: "Profil Indah",
      name: faker.random.word(),
      price: faker.random.number({ min: 5000, max: 10000 }),
    })
    .end();

  response.assertStatus(401);
});

test("Make sure office can create material data", async ({ client }) => {
  const response = await client
    .post("api/material")
    .header("X-AUTH-TOKEN", office.token)
    .send({
      supplier: "Profil Indah",
      name: faker.random.word(),
      price: faker.random.number({ min: 5000, max: 10000 }),
    })
    .end();

  response.assertStatus(200);
});

test("Make sure outfield can't update material data", async ({ client }) => {
  const response = await client
    .put("api/material/" + fakeMaterial.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .send({
      price: faker.random.number({ min: 5000, max: 10000 }),
    })
    .end();

  response.assertStatus(401);
});

test("Make sure office can update material data", async ({ client }) => {
  const response = await client
    .put("api/material/" + fakeMaterial.id)
    .header("X-AUTH-TOKEN", office.token)
    .send({
      price: faker.random.number({ min: 5000, max: 10000 }),
    })
    .end();

  response.assertStatus(200);
});

test("Make sure material suggest is work", async ({ client, assert }) => {
  const response = await client.get(`api/material/suggest?searchName=${fakeMaterial.name}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();

  response.assertStatus(200);
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0)
})

test("Make sure material suggest with supplier is work", async ({ client, assert }) => {
  const response = await client.get(`api/material/suggest?searchName=${fakeMaterial.name}&supplier=${fakeSupplier.id}`)
    .header('X-AUTH-TOKEN', office.token)
    .end();

  response.assertStatus(200);
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0)
})