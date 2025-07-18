import { useEffect, useRef, useState } from "react";
import { router, useRouter } from "expo-router";
import useAuthStore from "../Store/AuthStore";
import {
  handleForegroundMessages,
  handleBackgroundNotificationNavigation,
  requestPermissionAndGetToken,
} from "../utils/notification";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BackendUrl } from "../utils/Constants";
import notifee, { EventType } from '@notifee/react-native';


const registerToken = async ({ userId, token }) => {
  const res = await axios.post(`${BackendUrl}/api/admin/register-token`, {
    userId,
    token,
  });
  return res.data;
};

let hasSubscribed = false;

export default function useNotifications() {
  const { user } = useAuthStore();
  const router = useRouter();
  const listenerRef = useRef(null);
  const [token, setToken] = useState(null);

  const { mutateAsync: registerFCMToken } = useMutation({
    mutationFn: registerToken,
    onSuccess: () => console.log("✅ FCM token registered"),
    onError: (err) => console.error("❌ FCM registration failed:", err?.response?.data || err.message),
  });

  // Step 1: Request token when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      const fcmToken = await requestPermissionAndGetToken();
      console.log("✅ Token in hook:", fcmToken);
      setToken(fcmToken);
    };
    fetchToken();
  }, []);

  // Step 2: Register FCM token only when both token and user.userId are available
  useEffect(() => {
    if (!token || !user?.userId) return;

    registerFCMToken({ userId: user.userId, token });

    // Attach foreground listener once
    if (!hasSubscribed) {
      hasSubscribed = true;
      listenerRef.current = handleForegroundMessages();
      console.log("📲 Foreground message listener attached.");
    }

    handleBackgroundNotificationNavigation(router);

    return () => {
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
        console.log("🧹 Foreground message listener removed.");
        hasSubscribed = false;
      }
    };
  }, [token, user?.userId]);
}


export function handleNotificationTap(data) {
  const { screen, orderId, url } = data || {};
  // console.log("📲 Handling tap to:", screen, orderId, url);

  if (screen === 'offers') {
    router.push({
      pathname: '/offers',
      params: { orderId }, // ✅ pass as query param
    });
  } else if (screen === 'orderDetails' && orderId) {
    router.push(`/orders/${orderId}`);
  } else if (screen === 'web' && url) {
    router.push({
      pathname: '/webview',
      params: { url },
    });
  } else if (screen) {
    router.push(`/${screen}`);
  }
}



let listenersRegistered = false;

export const registerNotifeeListeners = () => {
  if (listenersRegistered) return;

  listenersRegistered = true;

  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      const data = detail.notification?.data || {};
      handleNotificationTap(data);
    }
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      const data = detail.notification?.data || {};
      handleNotificationTap(data);
    }
  });
};
