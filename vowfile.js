"use strict";

const ace = require("@adonisjs/ace");
const fs = require("fs");
const Helpers = use("Helpers");
const Env = use("Env");

/*
|--------------------------------------------------------------------------
| Vow file
|--------------------------------------------------------------------------
|
| The vow file is loaded before running your tests. This is the best place
| to hook operations `before` and `after` running the tests.
|
*/

// Uncomment when want to run migrations
// const ace = require('@adonisjs/ace')

module.exports = (cli, runner) => {
  runner.before(async () => {
    /*
    |--------------------------------------------------------------------------
    | Start the server
    |--------------------------------------------------------------------------
    |
    | Starts the http server before running the tests. You can comment this
    | line, if http server is not required
    |
    */
    await ace.call("migration:run", {}, { silent: false });
    await ace.call("seed", {}, { silent: true });
    use("Adonis/Src/Server").listen(process.env.HOST, process.env.PORT);

    /*
    |--------------------------------------------------------------------------
    | Run migrations
    |--------------------------------------------------------------------------
    |
    | Migrate the database before starting the tests.
    |
    */
    // await ace.call('migration:run', {}, { silent: true })
  });

  runner.after(async () => {
    /*
    |--------------------------------------------------------------------------
    | Shutdown server
    |--------------------------------------------------------------------------
    |
    | Shutdown the HTTP server when all tests have been executed.
    |
    */
    use("Adonis/Src/Server").getInstance().close();
    /*
    |--------------------------------------------------------------------------
    | Rollback migrations
    |--------------------------------------------------------------------------
    |
    | Once all tests have been completed, we should reset the database to it's
    | original state
    |
    */
    fs.rmdirSync(Helpers.tmpPath("assets"), { recursive: true });
    // fs.rmdirSync(Env.get("DRIVE_LOCAL_DIR"), { recursive: true });
    await ace.call("migration:reset", {}, { silent: true });
  });
};
