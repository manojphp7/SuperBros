// PushNotification.tsx
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useCart } from "../context/CartContext";

// Set global notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,  // 🔥 don't show banner
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Hook to listen for incoming notifications and response taps.
 */
export function usePushNotifications(onDataUpdate?: (data: any) => void) {

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const { expoTokenHandler } = useCart();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        expoTokenHandler(token)
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("🔄 Notification received in foreground:", notification);
      if (onDataUpdate) onDataUpdate(notification.request.content);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("🔁 Notification tapped (background/killed):", response);
      if (onDataUpdate) onDataUpdate(response.notification.request.content);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return expoPushToken;
}

/**
 * Request permission and get Expo push token.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    Alert.alert("Must use physical device for Push Notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Permission not granted for push notifications!");
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  } catch (error) {
    console.error("❌ Error getting push token:", error);
    return null;
  }
}

/**
 * Send a push notification to the specified token.
 */
export async function sendPushNotification(token: string, customData: any = {}) {
console.log("Expo sendPushNotification will send notification to : "+token)
  const message = {
    to: token,
    sound: "default",
    title: "You received a new Order",
    body: `Order ID ${customData['OrderID']}`,
    data: {  ...customData },
    content_available: true,
    priority: 'high',
  };
  
  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();
    console.log("📨 Push notification sent:", responseData);
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
  }
}


export async function sendSilentData(token: string, customData: any = {}) {
  if (!token || typeof token !== 'string') {
    console.error("❌ Invalid token provided:", token);
    return;
  }

  console.log("Expo sendSilentData will send notification to : "+token)
  const message = {
    to: token,
    sound: null, // no sound
    title: '',  // blank title
    body: '',   // blank body
    data: {  ...customData },
    content_available: true,   // <--- ADD THIS
    priority: 'high',     
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
  }
}



