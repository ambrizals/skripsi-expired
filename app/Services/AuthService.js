const jwt = use("JwtService");
const Karyawan = use("App/Models/Karyawan/Karyawan");

class AuthService {
  constructor() {
    this.jwt = new jwt();
  }

  async findUser(username) {
    const data = await Karyawan.query()
      .select("id", "password", "role", "username", "fullname", "is_active")
      .with("jabatan", (builder) => {
        builder.select(["id", "name", "isOffice", "isOwner"]);
      })
      .where("username", username)
      .first();
    
    this.result = await data.toJSON();
    return this.result;
  }

  async getUser(payload) {
    return await this.jwt.verify(payload).payload();
  }

  // For test purpose only
  async createTest(payload) {
    if(process.env.NODE_ENV !== 'testing') {
      return null;
    } else {
      const user = await this.findUser(payload.username || payload);
      const credentials = await this.jwt.generate(user).make();
      return {
        ...credentials,
        user
      }      
    }
  }
}

module.exports = AuthService;
