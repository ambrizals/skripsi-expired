"use strict";

const Factory = use("Factory");
const Suite = use("Test/Suite")("Authentication");
const Karyawan = use("App/Models/Karyawan/Karyawan");

const { test, trait, before, after } = Suite;

trait("Test/ApiClient");
trait("DatabaseTransactions");

let state;
let authState;

before(async () => {
  const karyawan = await Factory.model("App/Models/Karyawan/Karyawan").make();
  state = { username: karyawan.username, password: karyawan.password };
  await karyawan.save();
});

test("error when password field is null", async ({ client }) => {
  const response = await client
    .post("/api/auth")
    .send({
      username: state.username,
    })
    .end();
  response.assertStatus(400);
});

test("error when username field is null", async ({ client }) => {
  const response = await client
    .post("/api/auth")
    .send({
      password: state.password,
    })
    .end();
  response.assertStatus(400);
});

test("Error when username is not exists", async ({ client }) => {
  const response = await client
    .post("/api/auth")
    .send({
      username: "acobasdok",
      password: state.password,
    })
    .end();
  response.assertStatus(400);
});

test("Error when password is not correct", async ({ client }) => {
  const response = await client
    .post("/api/auth")
    .send({
      username: state.username,
      password: "oaijsdao",
    })
    .end();
  response.assertStatus(401);
});

test("Create Authentication Token", async ({ client }) => {
  const response = await client
    .post("/api/auth")
    .send({
      username: state.username,
      password: state.password,
    })
    .end();
  const authData = JSON.parse(response.text);
  authState = {
    type: authData.payload.type,
    token: authData.payload.token,
  };
  response.assertStatus(202);
});

test("Check Authorization", async ({ client, assert }) => {
  const response = await client
    .get("/api/auth")
    .header("X-AUTH-TOKEN", authState.token)
    .end();
  response.assertStatus(200);
  const result = JSON.parse(response.text);
  assert.isNotNull(result.payload.jabatan);
  assert.isNotNull(result.payload.fullname);
});

test("If token authorization is not valid", async ({ client }) => {
  const response = await client
    .get("/api/auth")
    .header(
      "X-AUTH-TOKEN",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    )
    .end();
  response.assertStatus(401);
});
