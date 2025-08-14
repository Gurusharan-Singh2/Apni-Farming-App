import { Platform, PermissionsAndroid } from "react-native";
import notifee, { AndroidImportance, AndroidStyle, EventType } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

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


export const handleForegroundMessages = () => {
  return messaging().onMessage(async (remoteMessage) => {

    const data = extractNotificationData(remoteMessage);
    
    await displayNotification(data);
  });
};


export const handleBackgroundNotificationNavigation = (router) => {
  
  messaging().onNotificationOpenedApp((remoteMessage) => {

    const data = extractNotificationData(remoteMessage);
    
    navigateToScreen(router, data);
  });


  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      
      const data = extractNotificationData(remoteMessage);
     
      navigateToScreen(router, data);
    });

  // Foreground notification tap
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
     
      navigateToScreen(router, detail.notification?.data || {});
    }
  });
};


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
 
  if (screen === "order-details" && id) {
    router.push(`/order-details/${id}`);
  } else if (screen === "offers") {
    router.push("/offers");
  } else if (screen === "web" && url) {
    router.push(`/webview?url=${encodeURIComponent(url)}`);
  } else if (screen) {
    router.push(`/${screen}`);
  }
}
