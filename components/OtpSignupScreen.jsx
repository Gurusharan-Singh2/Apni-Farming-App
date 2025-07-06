import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { BackendUrl } from "../utils/Constants";
import useAuthStore from "../Store/AuthStore";
import OtpInput from "../components/OtpInput"; // adjust path as needed

const OtpSignupScreen = ({ length = 6, userData }) => {
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(60);
  const router = useRouter();

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
      });
      router.push("/home");
    },
    onError: (error) => {
      console.error("Verification failed:", error);
      Alert.alert("Error", "Invalid OTP or server error.");
    },
  });

  const onSubmit = () => {
    if (otpValue.length !== length) {
      Alert.alert("Error", `Please enter all ${length} digits`);
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
      Alert.alert("Success", "OTP resent successfully");
      setTimer(60);
      setOtpValue(""); // Clear old OTP
    },
    onError: (error) => {
      console.error("Resend failed:", error);
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
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
      <OtpInput length={length} value={otpValue} onChange={setOtpValue} />

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

      {/* Error Message */}
      {VerifyMutation.isError && (
        <Text className="text-red-500 text-xs mt-1 text-center">
          {VerifyMutation.error?.message || "Verification failed"}
        </Text>
      )}

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

      {/* Resend Error */}
      {ResendMutation.isError && (
        <Text className="text-red-500 text-xs mt-1 text-center">
          {ResendMutation.error?.message || "Failed to resend OTP"}
        </Text>
      )}
    </View>
  );
};

export default OtpSignupScreen;
