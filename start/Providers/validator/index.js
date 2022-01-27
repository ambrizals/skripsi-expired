const Validator = use("Validator");
const ValidatorExists = use("./exists");

const all = () => {
  Validator.extend("exists", ValidatorExists);
};

module.exports = all;
