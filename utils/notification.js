import notifee, { AndroidImportance, AndroidStyle } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";


import { Platform, PermissionsAndroid } from "react-native";


// Request permission + token
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

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) return null;

    const token = await messaging().getToken();
    console.log("🔥 FCM Token:", token);
    return token;
  } catch (e) {
    console.error("❌ Token error:", e.message);
    return null;
  }
};

// Display notification only in foreground
export const displayNotification = async ({ title, body, image, screen, orderId, url }) => {
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
      id: 'default',
      launchActivity: 'default',
    },
  },
  data: {
    title: title || '',
    body: body || '',
    image: image || '',
    screen: screen || '',
    orderId: orderId || '',
    url: url || '',
  }, // ✅ explicitly add data here
});

};


// Foreground handler
export const handleForegroundMessages = () => {
  return messaging().onMessage(async (remoteMessage) => {
    console.log("📩 Foreground message:", remoteMessage.data);
    if (remoteMessage?.data) {
      const { title, body, image, screen, orderId, url } = remoteMessage.data;
      await displayNotification({ title, body, image, screen, orderId, url });
    }
  });
};




export const handleBackgroundNotificationNavigation = (router) => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    const data = remoteMessage?.data || remoteMessage?.notification?.data;
    if (data) {
      const { screen, orderId, url } = data;
      console.log("🔄 App opened from background", screen, orderId);
      navigateToScreen(router, screen, { orderId, url });
    } else {
      console.warn("⚠️ No data found in background tap");
    }
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      const data = remoteMessage?.data || remoteMessage?.notification?.data;
      if (data) {
        const { screen, orderId, url } = data;
        console.log("🚀 App launched from quit state", screen, orderId);
        navigateToScreen(router, screen, { orderId, url });
      } else {
        console.warn("⚠️ No data found in quit state tap");
      }
    });
};


// Helper function for navigation
function navigateToScreen(router, screen, { orderId, url }) {
  if (screen === 'offers') {
    router.push('/offers');
  } else if (screen === 'orderDetails' && orderId) {
    router.push(`/orders/${orderId}`);
  } else if (screen === 'web' && url) {
    router.push(`/webview?url=${encodeURIComponent(url)}`);
  } else {
    router.push(`/${screen}`); // fallback
  }
}



