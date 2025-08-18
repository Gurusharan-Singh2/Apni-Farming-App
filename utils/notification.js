import { Platform, PermissionsAndroid } from "react-native";
import notifee, { AndroidImportance, AndroidStyle, EventType } from "@notifee/react-native";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";

// Track last notification to avoid duplicate navigation
let lastNotificationId = null;

// ----------------------
// REQUEST PERMISSION + GET TOKEN
// ----------------------
export const requestPermissionAndGetToken = async () => {
  try {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("Notification permission not granted");
        return null;
      }
    }

    const authStatus = await requestPermission(getMessaging(getApp()));
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) return null;

    const token = await getToken(getMessaging(getApp()));
    return token;
  } catch (e) {
    console.error("❌ Token error:", e.message);
    return null;
  }
};

// ----------------------
// DISPLAY NOTIFICATION
// ----------------------
export const displayNotification = async ({ title, body, image, screen, id, url }) => {
  await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: "default",
      smallIcon: "ic_launcher",
      largeIcon: image,
      style: image ? { type: AndroidStyle.BIGPICTURE, picture: image } : undefined,
      pressAction: {
        id: "default",
        launchActivity: "default",
      },
    },
    data: { title, body, image, screen, id, url },
  });
};

// ----------------------
// FOREGROUND MESSAGES
// ----------------------
export const handleForegroundMessages = () => {
  return onMessage(getMessaging(getApp()), async (remoteMessage) => {
    const data = extractNotificationData(remoteMessage);
    await displayNotification(data);
  });
};

// ----------------------
// BACKGROUND + INITIAL NAVIGATION
// ----------------------
export const handleBackgroundNotificationNavigation = (router) => {
  // Background → tap
  onNotificationOpenedApp(getMessaging(getApp()), (remoteMessage) => {
    const data = extractNotificationData(remoteMessage);
    navigateIfNotDuplicate(router, data);
  });

  // Cold start → tap
  getInitialNotification(getMessaging(getApp())).then((remoteMessage) => {
    if (remoteMessage) {
      const data = extractNotificationData(remoteMessage);
      navigateIfNotDuplicate(router, data);
    }
  });

  // Foreground tap
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      navigateIfNotDuplicate(router, detail.notification?.data || {});
    }
  });
};

// ----------------------
// HELPERS
// ----------------------
function navigateIfNotDuplicate(router, data) {
  const uniqueId = data.id || data.url || `${data.screen}-${Date.now()}`;

  if (lastNotificationId === uniqueId) return;
  lastNotificationId = uniqueId;

  navigateToScreen(router, data);
}

function extractNotificationData(remoteMessage) {
  if (!remoteMessage) return {};

  const rawData = remoteMessage.data || {};
  return {
    title: rawData.title || remoteMessage.notification?.title || "",
    body: rawData.body || remoteMessage.notification?.body || "",
    image: rawData.image || remoteMessage.notification?.android?.imageUrl || "",
    screen: rawData.screen || "",
    id: rawData.id || "",
    url: rawData.url || "",
  };
}

function navigateToScreen(router, { screen, id, url }) {
  // Use replace to avoid "back to same page" issues
  if (screen === "order-details" && id) {
    router.replace(`/order-details/${id}`);
  } else if (screen === "offers") {
    router.replace("/offers");
  } else if (screen === "web" && url) {
    router.replace(`/webview?url=${encodeURIComponent(url)}`);
  } else if (screen) {
    router.replace(`/${screen}`);
  }
}
