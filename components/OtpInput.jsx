import React, { useRef } from "react";
import { View, TextInput } from "react-native";

const OtpInput = ({ length = 6, value = "", onChange }) => {
  const inputs = useRef([]);

  const handleVisibleChange = (text, index) => {
    const digits = text.replace(/[^0-9]/g, "");
    let newValue = value.split("");

    newValue[index] = digits[0] || "";
    onChange(newValue.join("").slice(0, length));

    if (digits && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleHiddenInputChange = (text) => {
    const clean = text.replace(/[^0-9]/g, "").slice(0, length);
    onChange(clean);
  };

  return (
    <View className="items-center">
      {/* Hidden input for autofill */}
      <TextInput
        className="absolute opacity-0 h-0 w-0"
        value={value}
        onChangeText={handleHiddenInputChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        importantForAutofill="yes"
        autoFocus
      />

      {/* Visible OTP boxes */}
      <View className="flex-row space-x-3">
        {Array.from({ length }).map((_, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            className="w-12 h-14 text-xl text-center border border-gray-300 rounded-lg bg-white"
            maxLength={1}
            keyboardType="number-pad"
            value={value[i] || ""}
            onChangeText={(text) => handleVisibleChange(text, i)}
            onKeyPress={(e) => handleBackspace(e, i)}
            caretHidden={true}
            selectTextOnFocus={false}
          />
        ))}
      </View>
    </View>
  );
};

export default OtpInput;
