import 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import config from '../../config.json';


Notification.requestPermission()
    .then((res) => {
        const firebaseApp = initializeApp({
            apiKey: config['firebaseApp'].apiKey,
            authDomain: config['firebaseApp'].authDomain,
            projectId: config['firebaseApp'].projectId,
            storageBucket: config['firebaseApp'].storageBucket,
            messagingSenderId: config['firebaseApp'].messagingSenderId,
            appId: config['firebaseApp'].appId,
        })
        const messaging = getMessaging(firebaseApp);
        getToken(messaging, { vapidKey: config['firebaseApp'].vapidKey })
            .then((token) => {

                localStorage.device_id = token;

                onMessage(messaging, (payload) => {
                    const notification = payload.notification;
                    var notificationWindow = new Notification(notification.title, {
                        body: notification.body,
                        icon: notification.icon,
                        data: notification.data,
                        vibrate: [200, 100, 200, 100, 200, 100, 200],
                        tag: "vibration-sample",
                    });
                    notificationWindow.onclick = function () {
                        window.parent.focus();
                        notification.close();
                    }
                });

            })

    });