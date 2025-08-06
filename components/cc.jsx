import React from "react";
import { View, Text } from "react-native";

const CancellationPolicy = () => {
  return (
    <View className="bg-white rounded-2xl px-6 my-1 ">
      <Text className="text-base font-bold text-gray-800">
        Cancellation Policy
      </Text>
      <Text className="text-sm text-gray-600 mt-2 leading-relaxed">
        Orders cannot be cancelled once packed for delivery. In case of
        unexpected delays, a refund will be provided, if applicable.
      </Text>
    </View>
  );
};

export default CancellationPolicy;
