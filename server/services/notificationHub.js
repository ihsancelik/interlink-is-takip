const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { getUserId } = require('./token-service');


// WebSocket bağlantılarını saklamak için bir nesne oluşturun
var connections = [];

function initializeNotificationWebSocketServer(server) {
    // WebSocket sunucusunu oluşturun
    const wss = new WebSocket.Server({ server });

    // WebSocket bağlantılarını dinleyin
    wss.on('connection', (ws, req) => {
        try {
            // Authorization başlığını kontrol edin ve JWT'yi alın
            const user_id = getUserId(req);

            // claims null ise connection reddedilir
            if (!user_id) {
                console.error('Yetkisiz bağlantı');
                ws.close();
                return;
            }

            // Yeni bir bağlantı olduğunda
            console.log('Yeni bir WebSocket bağlantısı kuruldu.');

            ws.on('close', () => {
                // Bağlantı kapatıldığında
                console.log('WebSocket bağlantısı kapatıldı.');

                // İlgili kullanıcının bağlantısını kaldırın
                connections = connections.filter(x => x.ws != ws);
            });
        } catch (error) {
            console.error(error);
        }
    });
}

function isUserOnline(userid) {
    // İlgili kullanıcının bağlantısını bulun
    const userConnections = connections.find(x => x.user_id == userid);
    return userConnections && userConnections.length > 0;
}

function sendLiveNotification(userid, title, body) {
    const message = req.query.message;

    // İlgili kullanıcının bağlantısını bulun
    const userConnections = connections.find(x => x.user_id == userid);
    userConnections.forEach(con => {
        // Kullanıcıya bildirim gönderin
        con.ws.send(message);
    });
    if (ws) {
        // Kullanıcıya bildirim gönderin
        ws.send(message);
    }
}


module.exports = {
    initializeNotificationWebSocketServer,
    sendLiveNotification,
    isUserOnline
}