import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { BackendUrl } from "../utils/Constants";
import useAuthStore from "../Store/AuthStore";
import OtpInput from "../components/OtpInput"; // adjust path as needed
import { toastConfig } from "../hooks/toastConfig";

const OtpSignupScreen = ({ userData }) => {
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(60);
  const router = useRouter();

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const VerifyMutation = useMutation({
    mutationFn: async ({ userData, otp }) => {
      const response = await axios.post(`${BackendUrl}/api/verify`, {
        ...userData,
        otp,
      });
      return response.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().login({
        name: data.name,
        userId: data.userId,
        email: userData.email,
        token: data.token,
        phone: data.phone,
      });
      router.push("/home");
    },
    onError: (error) => {
      console.error("Verification failed:", error);
      showToast("error", "Verification Failed", "Invalid OTP or server error.");
    },
  });

  const onSubmit = () => {
    if (otpValue.length < 5) {
      showToast("error", "Invalid OTP", "OTP must be at least 5 digits.");
      return;
    }

    VerifyMutation.mutate({ userData, otp: otpValue });
  };

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const ResendMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`${BackendUrl}/api/resend`, data);
      return response.data;
    },
    onSuccess: () => {
      showToast("success", "OTP Resent", "OTP resent successfully.");
      setTimer(60);
      setOtpValue(""); // Clear old OTP
    },
    onError: (error) => {
      console.error("Resend failed:", error);
      showToast("error", "Resend Failed", "Please try again.");
    },
  });

  const handleResend = () => {
    ResendMutation.mutate(userData);
  };

  return (
    <View className="w-full max-w-md space-y-6 p-4">
      <Text className="text-xl font-bold text-gray-900 text-center">Enter OTP</Text>
      <Text className="text-sm text-gray-600 text-center">
        We've sent an OTP to your provided contact
      </Text>

      {/* OTP Input Field */}
      <OtpInput value={otpValue} onChange={setOtpValue} />

      {/* Submit Button */}
      <TouchableOpacity
        onPress={onSubmit}
        className="bg-primary rounded-lg py-3 mt-4"
        disabled={VerifyMutation.isPending}
      >
        <Text className="text-white text-center text-base font-semibold">
          {VerifyMutation.isPending ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      {/* Resend Timer */}
      {timer > 0 ? (
        <Text className="text-sm text-gray-500 text-center">
          You can resend the code in{" "}
          <Text className="font-semibold text-gray-800">{timer}s</Text>
        </Text>
      ) : (
        <TouchableOpacity onPress={handleResend}>
          <Text className="text-sm font-semibold text-primary text-center underline">
            {ResendMutation.isPending ? "Resending..." : "Resend OTP"}
          </Text>
        </TouchableOpacity>
      )}


    </View>
  );
};

export default OtpSignupScreen;
