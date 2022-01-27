"use strict"
const admin = require('firebase-admin');
const serviceAccount = require('../keys/bangbangdecor-8b130-firebase-adminsdk-sd6zw-151620394d.json')
const Time = use("Time");
const Env = use('Env');
const Logger = use('Logger');

class fcm {
    static post(pt, channel) {
        // let status;
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://bangbangdecor-8b130.firebaseio.com"
            })
        }
        let message = {
            data: {
              notification: JSON.stringify({
                title: pt.title,
                body: pt.body,
              }),
              data: JSON.stringify({
                id: Time.TimeOnlyNumber(),
                type: pt.type,
                value: pt.data,
              })
            },
            topic: channel
        }

        if(Env.get('ENABLE_FCM') === 'true') {
          let status = admin.messaging().send(message).then((response) => {
            return response
          }).catch((err) => {
            console.log(err)
            return err
          })

          return status
        } else {
          if(process.env.NODE_ENV !== 'testing') {
            Logger.info("FCM Enable Environment is Disable or Is Not Exists", message);
            console.info('FCM Enable Environment is Disable or Is Not Exists, Check Logger.');            
          }
        }
    }

    async subscribeToTopic(token, topic) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: "https://bangbangdecor-8b130.firebaseio.com"
        })
      }

      if(Env.get('ENABLE_FCM') === 'true') {
        let status = admin.messaging().subscribeToTopic(token, topic).then((response) => {
          return response
        }).catch((err) => {
          console.log(err)
          return err
        })

        return status
      } else {
        Logger.info("FCM Enable Environment is Disable or Is Not Exists", {
          topic,
          token
        });
        console.info('FCM Enable Environment is Disable or Is Not Exists, Check Logger.');
      }
    }
}

module.exports = fcm;
