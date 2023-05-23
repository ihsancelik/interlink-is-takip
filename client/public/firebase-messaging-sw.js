importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js');

const app = firebase.initializeApp({

    apiKey: "AIzaSyDMR3It86XHE1vd7udZ4AsfdeS0zUK7CNU",
    authDomain: "interlink-is-takip.firebaseapp.com",
    projectId: "interlink-is-takip",
    storageBucket: "interlink-is-takip.appspot.com",
    messagingSenderId: "569688326812",
    appId: "1:569688326812:web:fc36f5ff509bfe824d6359"

});

// Retrieve firebase messaging
const messaging = app.messaging();