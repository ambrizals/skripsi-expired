"use strict";
const faker = require("faker");

const Factory = use("Factory");
const Karyawan = use("App/Models/Karyawan/Karyawan");

const { test, trait, before } = use("Test/Suite")("Karyawan Test");

const AuthService = use("AuthService");

trait("Test/ApiClient");
trait("DatabaseTransactions");

let user;
let unsignedUser;
let unsignedUN;
let karyawanBaru;

const auth = new AuthService();

before(async () => {
  user = await auth.createTest("bams");
  const { username } = await Factory.model(
    "App/Models/Karyawan/Karyawan"
  ).create();

  const KaryawanBaru = await Factory.model('App/Models/Karyawan/Karyawan').create();
  karyawanBaru = KaryawanBaru.toJSON();
  unsignedUN = username;
  unsignedUser = await auth.createTest(username);
});

test("Make sure is employee is accessible", async ({ client }) => {
  const response = await client
    .get("/api/employee")
    .header("X-AUTH-TOKEN", user.token)
    .end();
  response.assertStatus(200);
});

test("Make sure employee cannot access except owner", async ({ client }) => {
  const response = await client
    .get("/api/employee")
    .header("X-AUTH-TOKEN", unsignedUser.token)
    .end();
  response.assertStatus(401);
});

test("Make sure employee list can sort ascending by created date", async ({
  client,
  assert,
}) => {
  const response = await client
    .get("/api/employee?sortDate=true")
    .header("X-AUTH-TOKEN", user.token)
    .end();
  const json = response.body;
  assert.equal("true", json.http.request.sortDate);
});

test("Make sure employee list can search fullname", async ({
  client,
  assert,
}) => {
  const response = await client
    .get("/api/employee?searchFullname=ba")
    .header("X-AUTH-TOKEN", user.token)
    .end();
  const json = response.body;
  assert.equal("ba", json.http.request.searchFullname);
});

test("Make sure employee ID 1 is exists", async ({ client }) => {
  const response = await client
    .get("/api/employee/1")
    .header("X-AUTH-TOKEN", user.token)
    .end();
  response.assertStatus(200);
});

test("If employee ID 93 is not exists", async ({ client }) => {
  const response = await client
    .get("/api/employee/93")
    .header("X-AUTH-TOKEN", user.token)
    .end();
  response.assertStatus(404);
});

test("Employee fail validation test", async ({ client }) => {
  const response = await client
    .post("/api/employee")
    .header("X-AUTH-TOKEN", user.token)
    .end();
  response.assertStatus(400);
});

test("Create Employee Data", async ({ client }) => {
  const createPassword = faker.internet.password();
  const response = await client
    .post("/api/employee")
    .header("X-AUTH-TOKEN", user.token)
    .send({
      username: faker.internet.userName(),
      password: createPassword,
      confirmPassword: createPassword,
      fullname: faker.name.firstName(),
      home_address: faker.address.streetAddress(),
      phone_number: faker.phone.phoneNumberFormat(),
    })
    .end();
  response.assertStatus(200);
});

test("Check Validation Fail Test", async ({ client }) => {
  const dummy = await auth.getUser(unsignedUser.token);
  const response = await client
    .put("api/employee/" + dummy.id)
    .header("X-AUTH-TOKEN", user.token)
    .send({
      home_address: faker.address.streetAddress(),
      phone_number: faker.phone.phoneNumberFormat(),
    })
    .end();
  response.assertStatus(400);
});

test("Update Employee Data", async ({ client }) => {
  const dummy = await auth.getUser(unsignedUser.token);
  const response = await client
    .put("api/employee/" + dummy.id)
    .header("X-AUTH-TOKEN", user.token)
    .send({
      username: faker.internet.userName(),
      fullname: faker.name.firstName(),
      home_address: faker.address.streetAddress(),
      phone_number: faker.phone.phoneNumberFormat(),
    })
    .end();
  response.assertStatus(200);
});

test("Change Employee Password", async ({ client }) => {
  const password_test = faker.internet.password();
  const dummy = await auth.getUser(unsignedUser.token);
  const response = await client
    .put("api/employee/password/" + dummy.id)
    .header("X-AUTH-TOKEN", user.token)
    .send({
      password: password_test,
      confirmPassword: password_test
    })
    .end();
  response.assertStatus(200);
});

test("Make sure validator on changing employee password is success", async ({ client }) => {
  const password_test = faker.internet.password();
  const dummy = await auth.getUser(unsignedUser.token);

  const response_confirm_password_not_inserted = await client
    .put("api/employee/password/" + dummy.id)
    .header("X-AUTH-TOKEN", user.token)
    .send({
      password: password_test,
    })
    .end();
  response_confirm_password_not_inserted.assertStatus(400);
  
  const response_confirm_password_not_same = await client
    .put("api/employee/password/" + dummy.id)
    .header("X-AUTH-TOKEN", user.token)
    .send({
      password: password_test,
      confirmPassword: 'harusnyasalah'
    })
    .end();
  response_confirm_password_not_same.assertStatus(400);  
});

test("Make sure karyawan suggest is accessible", async ({ client, assert }) => {
  const response = await client.get(`api/karyawan/suggest?searchName=${karyawanBaru.fullname}`)
    .header('X-AUTH-TOKEN', user.token)
    .end();

  response.assertStatus(200);
  const result = JSON.parse(response.text);
  assert.isAbove(result.payload.length, 0);
  assert.notExists(result.payload[0].password);
})