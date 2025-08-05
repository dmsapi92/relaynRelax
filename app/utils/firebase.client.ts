import { initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getMessaging,
  getToken,
  isSupported,
  Messaging,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCL-Dd8jVzelGzP1iAHLuSLa4RsnboWQds",
  authDomain: "dmshotel-7fdc6.firebaseapp.com",
  projectId: "dmshotel-7fdc6",

  storageBucket: "dmshotel-7fdc6.appspot.com",
  messagingSenderId: "939968723016",
  appId: "1:939968723016:web:a87fcd2d8a19d39f07007d",
};

// Initialize Firebase
let auth: Auth | undefined;
let messaging: Messaging | undefined;
export const appFirebase = initializeApp(firebaseConfig);
export const authFirebase = getAuth(appFirebase);

export const initializeFirebase = async () => {
  if (typeof window !== "undefined") {
    try {
      auth = getAuth(appFirebase);
      const isFCMSupported = await isSupported();
      if (isFCMSupported) {
        messaging = getMessaging(appFirebase);
      }
    } catch (err) {
      console.error("Failed to initialize Firebase:", err);
    }
  }
};

// Initialize Firebase when the module loads
initializeFirebase();

// VAPID key for web push notifications
const VAPID_KEY =
  "BEgrTOzvxByoh4qHfr19EmqBhSZZexAUYfszSys6MmC_wmpTpIs2DiNJAu-2JRl1NnKgEIPuoQ8sXgl_w9g42qk";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(authFirebase, provider);
    return {
      user: result.user,
      token: await result.user.getIdToken(),
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const requestNotificationPermission = async () => {
  if (!messaging) {
    throw new Error(
      "Firebase Cloud Messaging is not supported in this browser"
    );
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });

      // Send token to the server
      await fetch("/api/fcm/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(token),
      });

      return token;
    }
    throw new Error("Notification permission denied");
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    throw error;
  }
};

export const onMessageListener = () => {
  if (!messaging) {
    throw new Error(
      "Firebase Cloud Messaging is not supported in this browser"
    );
  }

  const messagingInstance = messaging; // Create a stable reference after the null check

  return (callback: (payload: any) => void) => {
    const unsubscribe = onMessage(messagingInstance, (payload) => {
      callback(payload);
    });

    return unsubscribe;
  };
};
