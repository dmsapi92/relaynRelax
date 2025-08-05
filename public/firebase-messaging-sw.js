importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCL-Dd8jVzelGzP1iAHLuSLa4RsnboWQds",
  authDomain: "dmshotel-7fdc6.firebaseapp.com",
  databaseURL:
    "https://dmshotel-7fdc6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dmshotel-7fdc6",
  storageBucket: "dmshotel-7fdc6.appspot.com",
  messagingSenderId: "939968723016",
  appId: "1:939968723016:web:a87fcd2d8a19d39f07007d",
  measurementId: "G-89QEH4KYCV",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "/favicon.ico",
    data: payload.data,
    tag: payload.data.messageId, // Use messageId as tag to group notifications
    renotify: true, // Allow new notifications even if there's an existing one with same tag
    requireInteraction: true, // Keep notification visible until user interacts with it
    actions: [
      {
        action: "view",
        title: "View Message",
      },
    ],
  };

  // Show the notification
  // self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  console.log("[firebase-messaging-sw.js] Notification clicked:", event);

  event.notification.close();

  // Get the notification data
  const data = event.notification.data;

  // Use click_action from notification or fallback to data.url
  let urlToOpen = data.url || "/";
  if (event.notification.data && event.notification.data.click_action) {
    urlToOpen = event.notification.data.click_action;
  }

  // Add origin if URL is relative
  if (urlToOpen.startsWith("/")) {
    urlToOpen = `${self.location.origin}${urlToOpen}`;
  }

  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // Get the URL without the origin
        const clientUrl = new URL(client.url).pathname;
        const targetUrl = new URL(urlToOpen).pathname;

        // If we find a matching client, focus it and post the message data
        if (clientUrl === targetUrl && "focus" in client) {
          client.focus();
          // Post message to client with notification data
          client.postMessage({
            type: "notification_clicked",
            data: data,
          });
          return;
        }
      }

      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen).then((client) => {
          if (client) {
            // Wait a bit for the page to load then post the message
            setTimeout(() => {
              client.postMessage({
                type: "notification_clicked",
                data: data,
              });
            }, 1000);
          }
        });
      }
    });

  event.waitUntil(promiseChain);
});
