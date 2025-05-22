import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { registerForPushNotificationsAsync } from "./notification";

// Set global notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false, // ✅ new
    shouldShowList: false,   // ✅ new
  }),
});

type NotificationContent = Notifications.NotificationContent;

/**
 * Hook to listen for incoming notifications and response taps.
 */
export function usePushNotifications(
  onDataUpdate?: (data: NotificationContent) => void
): string | null {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<ReturnType<typeof Notifications.addNotificationReceivedListener> | null>(null);
  const responseListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("🔄 Notification received in foreground:", notification);
      if (onDataUpdate) {
        onDataUpdate(notification.request.content);
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("🔁 Notification tapped (background/killed):", response);
      if (onDataUpdate) {
        onDataUpdate(response.notification.request.content);
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return expoPushToken;
}
