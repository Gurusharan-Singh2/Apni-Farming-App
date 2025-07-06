import { useRouter } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "../Store/AuthStore";
import {
  handleBackgroundNotificationNavigation,
  handleForegroundMessages,
  requestPermissionAndGetToken,
} from "../utils/notification";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const registerToken = async ({ userId, token }) => {
  const res = await axios.post("https://apni-farming-backend.onrender.com/api/admin/register-token", {
    userId,
    token,
  });
  return res.data;
};

export default function useNotifications() {
  const { user } = useAuthStore();
  const router = useRouter();

  const { mutateAsync: registerFCMToken } = useMutation({
    mutationFn: registerToken,
    onSuccess: () => {
      console.log("✅ FCM token registered via React Query");
    },
    onError: (err) => {
      console.error("❌ FCM registration failed:", err.message);
    },
  });

  useEffect(() => {
    const setupNotifications = async () => {
      const token = await requestPermissionAndGetToken();

      if (token && user?.userId) {
        await registerFCMToken({ userId: user.userId, token });
      }

      const unsubscribe = handleForegroundMessages();
      handleBackgroundNotificationNavigation(router);

      return () => unsubscribe();
    };

    setupNotifications();
  }, [user?.userId]);
}
