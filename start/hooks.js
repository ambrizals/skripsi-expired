const { hooks } = require("@adonisjs/ignitor");

hooks.after.providersBooted(() => {
  const ValidatorExists = use("./Providers/validator");

  ValidatorExists();
});
