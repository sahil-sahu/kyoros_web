importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyCrkzvLKkQfymq0ypSGnf46VCmH7HVvqts",
    authDomain: "kyoros-f71b1.firebaseapp.com",
    projectId: "kyoros-f71b1",
    storageBucket: "kyoros-f71b1.appspot.com",
    messagingSenderId: "461541994029",
    appId: "1:461541994029:web:3d9da636b7ca0c3070d2a4",
    measurementId: "G-FJ4531VJF3"
  };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});