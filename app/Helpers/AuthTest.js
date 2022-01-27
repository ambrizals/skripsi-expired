const Factory = use("Factory");
const AuthService = use("AuthService");

class AuthTest {
  constructor() {
    this.authService = new AuthService();
  }

  async init() {
    this._init = await Factory.model("App/Models/Karyawan/Karyawan").create();
    return this;
  }

  async owner() {
    return await this.authService.createTest("bams");
  }

  async create(level) {
    await this.init();
    await this._init.merge({ role: level });
    await this._init.save();
    return this;
  }

  async office() {
    await this.create(3);
    return await this.authService.createTest(this._init.toJSON());
  }

  async custom(name) {
    return await this.authService.createTest(name);
  }

  async outfield() {
    await this.create(5);
    return await this.authService.createTest(this._init.toJSON());
  }
}

module.exports = AuthTest;
