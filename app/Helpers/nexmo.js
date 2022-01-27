const Nexmo = require('nexmo');
const Env = use('Env');
const Logger = use('Logger');

class nexmo {
  constructor() {
    this.nex = new Nexmo({
      apiKey: '382e3cb8',
      apiSecret: 'IYlNa6j5AZj89kJX',
    });
  }

  publish(message, phoneNumber) {
    const phone = () => {
      if(phoneNumber.slice(0,1) === '0') {
        return '+62'+phoneNumber.substring(1)
      } else {
        return '+62'+phoneNumber;
      }
    }

    if(Env.get('ENABLE_SMS') === 'true') {
      this.nex.message.sendSms('bbd', phone(), message);
    } else {
      if(process.env.NODE_ENV !== 'testing') {
        Logger.info("SMS Enable Environment is Disable or Is Not Exists", {
          sender: 'bbd',
          recipient: phone(),
          message: message
        });
        console.info('SMS Enable Environment is Disable or Is Not Exists, Check Logger.', {
          sender: 'bbd',
          recipient: phone(),
          message: message
        });
      }
    }
  }
}

module.exports = nexmo;
