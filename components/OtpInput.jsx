import React from "react";
import { TextInput, View, Text } from "react-native";

const OtpInput = ({ value, onChange }) => {
  const handleChange = (text) => {
    const clean = text.replace(/[^0-9]/g, "");
    onChange(clean);
  };

  return (
    <View className="w-full">
      <Text className="text-sm mb-2 text-gray-700">Enter OTP</Text>
      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
        textContentType="oneTimeCode" // iOS autofill
        autoComplete="sms-otp"        // Android autofill
        importantForAutofill="yes"
        className="border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white"
      />
    </View>
  );
};

export default OtpInput;
