const { UserDevice } = require('../db')
const axios = require('axios');
const config = require('../config.json');

async function sendPushNotification(userid, title, body) {
    const userDevices = UserDevice.find({ user: userid });
    if (!userDevices)
        return;

    const fcm_url = config['google-fcm'].url;
    const fcm_authorization = config['google-fcm'].authorization;

    const headers = {
        "Content-Type": "application/json",
        "Authorization": fcm_authorization
    }

    var notification = {
        'title': title,
        'body': body,
        'click_action': 'http://localhost:8081'
    };

    let requestBody = {
        priority: "HIGH",
        notification: notification,
        to: '',
        data: {}
    }

    userDevices.forEach(async userDevice => {
        requestBody.to = userDevice.device_id;

        const response = await axios.post(fcm_url, requestBody, { headers: headers });
    });

}

module.exports = {
    sendPushNotification
}