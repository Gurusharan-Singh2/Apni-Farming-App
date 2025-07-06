// utils/notificationService.js
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance, AndroidStyle } from "@notifee/react-native";
import { Platform, PermissionsAndroid } from "react-native";

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

    if (!enabled) {
      console.warn("Permission denied");
      return null;
    }

    const fcmToken = await messaging().getToken();
    console.log("FCM Token:", fcmToken);
    return fcmToken;
  } catch (error) {
    console.error("Error getting permission/token:", error.message);
    return null;
  }
};

export const displayNotification = async ({ title, body, image, screen, orderId }) => {
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
      style: image
        ? {
            type: AndroidStyle.BIGPICTURE,
            picture: image,
          }
        : undefined,
    },
    data: {
      screen,
      orderId,
    },
  });
};

export const handleForegroundMessages = (callback) => {
  return messaging().onMessage(async (remoteMessage) => {
    console.log("Foreground Message:", remoteMessage);

    const { title, body, image, screen, orderId } = remoteMessage.data || {};

    await displayNotification({ title, body, image, screen, orderId });
    if (callback) callback(remoteMessage);
  });
};

export const handleBackgroundNotificationNavigation = (router) => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    const screen = remoteMessage.data?.screen;
    if (screen) {
      router.push(`/${screen}`);
    }
  });

  messaging().getInitialNotification().then((remoteMessage) => {
    if (remoteMessage) {
      const screen = remoteMessage.data?.screen;
      if (screen) {
        router.push(`/${screen}`);
      }
    }
  });
};
