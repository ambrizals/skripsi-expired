const { StatusCodes } = require('http-status-codes');
const HttpService = use('HttpService');
const fcm = use('App/Helpers/fcm');

class MessenggerController extends HttpService {
  constructor() {
    super();
    this.fcm = new fcm();
  }

	async generate({ request, response }) {
		this.fcm.post({
			title: 'coba',
			body: 'coba',
      type: 'login',
      data: '1'
		}, 'office');


		return response.send('Notification test sended to office topic');
	}

	async subscribe({ request, response }) {
    const req = request.all();
    await this.fcm.subscribeToTopic(req.token, req.topic);
    return this.payload({
      message: 'Subscribed to '+req.topic+' topic'
    }).request(request).status(StatusCodes.OK).res(response);
  }
}

module.exports = MessenggerController;
