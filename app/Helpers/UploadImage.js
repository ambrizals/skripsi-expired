const sharp = require("sharp");
const faker = require("faker");

const Drive = use("Drive");

class UploadImage {
  constructor() {
    this.assetsDir = "assets/";
  }

  product () {
    this.location = "product/";
    return this;
  }

  transaction () {
    this.location = "transaksi/";
    return this;
  }

  async create (payload) {
    const imageName = faker.random.uuid() + ".jpg";
    const path = this.location ? this.location + imageName : imageName;

    const image = await sharp(payload.tmpPath).toFormat("jpg").toBuffer();
    const thumb = await sharp(payload.tmpPath).resize({ width: 300 }).toBuffer();
    await Drive.put(`thumb/${path}`, Buffer.from(thumb));
    await Drive.put(path, Buffer.from(image));
    return imageName;
  }
}

module.exports = UploadImage;
