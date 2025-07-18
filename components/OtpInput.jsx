import React, { useRef } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";

const OtpInput = ({ length = 6, value = "", onChange }) => {
  const inputRef = useRef(null);

  const handleChange = (text) => {
    const clean = text.replace(/[^0-9]/g, "").slice(0, length);
    onChange(clean);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      className="items-center"
    >
      {/* Hidden real input for typing & autofill */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        importantForAutofill="yes"
        autoFocus
        className="absolute opacity-0 w-0 h-0"
      />

      {/* Render OTP digits in boxes */}
      <View className="flex-row space-x-3">
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            className="w-12 h-14 border border-gray-300 rounded-lg bg-white items-center justify-center"
          >
            <Text className="text-xl font-semibold text-gray-800">
              {value[i] || ""}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default OtpInput;
