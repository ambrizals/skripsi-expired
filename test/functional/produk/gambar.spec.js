const Helpers = use("Helpers");
const Factory = use("Factory");

const { test, trait, before } = use("Test/Suite")("Product Image Test");

const AuthTest = use("AuthTest");
const auth = new AuthTest();

trait("Test/ApiClient");

let office;
let outfield;

before(async () => {
  office = await auth.office();
  outfield = await auth.outfield();

  fakeData = await Factory.model("App/Models/Produk/Gambar").create();
});

test("Make sure product image list is accessible", async ({ client }) => {
  const response = await client
    .get("api/product/image/1")
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  response.assertStatus(200);
});

test("Make sure product image cannot upload by outfield employee", async ({
  client,
}) => {
  const response = await client
    .post("api/product/image/1")
    .header("X-AUTH-TOKEN", outfield.token)
    .attach("image", Helpers.resourcesPath("test/IMG-20200820-WA0003.jpg"))
    .end();

  response.assertStatus(401);
});

test("Make sure product image can be uploaded by office employee", async ({
  client,
}) => {
  const response = await client
    .post("api/product/image/1")
    .header("X-AUTH-TOKEN", office.token)
    .attach("image", Helpers.resourcesPath("test/IMG-20200820-WA0003.jpg"))
    .end();

  response.assertStatus(200);
});

test("Make sure product image can set as a cover", async ({
  client
}) => {
  const _fakeData = fakeData.toJSON();
  const response = await client.put('api/product/image/cover/' + _fakeData.id)
    .header('X-AUTH-TOKEN', office.token)
    .end()

  response.assertStatus(200)
})

test("Make sure product cannot be delete by outfield employee", async ({
  client,
}) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .delete("api/product/image/" + _fakeData.id)
    .header("X-AUTH-TOKEN", outfield.token)
    .end();
  response.assertStatus(401);
});

test("Make sure product can be delete by office employee", async ({
  client,
}) => {
  const _fakeData = fakeData.toJSON();
  const response = await client
    .delete("api/product/image/" + _fakeData.id)
    .header("X-AUTH-TOKEN", office.token)
    .end();
  response.assertStatus(200);
});