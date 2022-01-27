const jwt = require("jsonwebtoken");
const Config = use("Config");
const InvalidTokenException = use("App/Exceptions/JwtInvalidTokenException");

class JwtService {
  // JWT Method

  generate(payload) {
    delete payload.created_at;
    delete payload.updated_at;
    this._token = jwt.sign(payload, Config.get("app.appKey"), {
      algorithm: "HS256",
    });
    return this;
  }

  verify(token) {
    try {
      this._verify = jwt.verify(token, Config.get("app.appKey"));
      return this;
    } catch (error) {
      throw new InvalidTokenException();
    }
  }

  // Output method
  payload() {
    delete this._verify.iat;
    return this._verify;
  }

  make() {
    return {
      type: "Bearer",
      token: this._token,
    };
  }
}

module.exports = JwtService;
