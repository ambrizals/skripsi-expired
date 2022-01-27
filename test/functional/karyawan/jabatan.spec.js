const faker = require("faker");

const { test, trait, before } = use("Test/Suite")("Karyawan Jabatan Test");
const Factory = use("Factory");

const AuthService = use("AuthService");

trait("Test/ApiClient");
trait("DatabaseTransactions");

let Auth;
let unsignedAuth;

let unsignedUser;
let fakeData;

const auth = new AuthService();

before(async () => {
  unsignedUser = await Factory.model("App/Models/Karyawan/Karyawan").create();

  Auth = await auth.createTest("bams");
  unsignedAuth = await auth.createTest(unsignedUser.toJSON().username);

  fakeData = await Factory.model("App/Models/Karyawan/Jabatan").create();
});

// test("Make sure only owner can access it", async ({ client }) => {
//   const response = await client
//     .get("api/employee/role")
//     .header("X-AUTH-TOKEN", unsignedAuth.token)
//     .end();
//   response.assertStatus(401);
// });

test("Make sure employee role accessible", async ({ client }) => {
  const response = await client
    .get("api/employee/role")
    .header("X-AUTH-TOKEN", Auth.token)
    .end();
  response.assertStatus(200);
});

test("Make sure owner can create new role", async ({ client }) => {
  const response = await client
    .post("api/employee/role")
    .header("X-AUTH-TOKEN", Auth.token)
    .send({ name: faker.random.word(), isOffice: 1 })
    .end();
  response.assertStatus(200);
});

test("Make sure owner can update role", async ({ client }) => {
  const fakePayload = await fakeData.toJSON();
  const response = await client
    .put("api/employee/role/" + fakePayload.id)
    .header("X-AUTH-TOKEN", Auth.token)
    .send({ name: fakePayload.name, isOffice: 1, isOwner: false })
    .end();
  response.assertStatus(200);
});
