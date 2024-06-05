importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');
importScripts("https://cdn.jsdelivr.net/npm/dexie@3.0.3/dist/dexie.min.js");

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

const db = new Dexie("pings");

// Define a schema
db.version(2).stores({
    notes: '++id, title, description, severity, timeStamp, link'
});

// Open the database
db.open().catch(function (err) {
    console.error("Failed to open db: " + (err.stack || err));
});

function addNote(note) {
  db.notes.add(note).then(() => {
      console.log("Note has been added to your database.");
  }).catch((error) => {
      console.error("Unable to add data: " + error);
  });
}


// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  addNote({
      title: payload.notification.title,
      description: payload.notification.body,
      timeStamp: new Date(),
      severity: payload.data.severity,
      link: payload.fcmOptions?.link
  });
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});