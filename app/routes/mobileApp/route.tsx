import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { App as CapacitorApp } from "@capacitor/app";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Outlet } from "@remix-run/react";
import { useEffect, useRef } from "react";

export default function MobileAppLayout() {
  const isInitialized = useRef(false);

  const setFcmToken = async (token: string) => {
    try {
      fetch("/api/fcm/update", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      if (token) {
        console.log("Setting FCM token:", token);
      }
    } catch (error) {
      console.error("Error setting FCM token:", error);
    }
  };

  const showLocalNotification = async (
    title: string,
    body: string,
    link?: string
  ) => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Math.floor(Math.random() * 10000),
            attachments: undefined,
            actionTypeId: "",
            extra: link ? { link } : null,
          },
        ],
      });
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // Prevent duplicate initialization
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        // Request permission for notifications
        const { receive: currentPermission } =
          await FirebaseMessaging.checkPermissions();
        console.log("Current permission status:", currentPermission);

        if (currentPermission !== "granted") {
          const { receive } = await FirebaseMessaging.requestPermissions();
          console.log("Permission request result:", receive);
        }

        // Get FCM token
        const { token } = await FirebaseMessaging.getToken();
        console.log("FCM token:", token);
        setFcmToken(token);

        // Listen for messages when app is in foreground
        FirebaseMessaging.addListener(
          "notificationReceived",
          async (message) => {
            console.log("Foreground message received:", message);

            if (message.notification?.title && message.notification?.body) {
              const link = message.notification.data?.link;
              await showLocalNotification(
                message.notification.title,
                message.notification.body,
                link
              );
            }
          }
        );

        // Listen for message clicks
        FirebaseMessaging.addListener(
          "notificationActionPerformed",
          (action) => {
            console.log("Notification action performed:", action);
            const link = action.notification?.data?.link;
            if (link) {
              window.location.href = link;
            }
          }
        );

        return () => {
          FirebaseMessaging.removeAllListeners();
          isInitialized.current = false;
        };
      } catch (error) {
        console.error("Error initializing Firebase Messaging:", error);
        isInitialized.current = false;
      }
    };

    initialize();

    const handleBackButton = async () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        const shouldExit = window.confirm("Do you want to exit the app?");
        if (shouldExit) {
          CapacitorApp.exitApp();
        }
      }
    };

    CapacitorApp.addListener("backButton", handleBackButton);

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  return <Outlet />;
}
