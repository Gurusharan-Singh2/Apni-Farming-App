import React from "react";
import { View, Text } from "react-native";

const CancellationPolicy = () => {
  return (
    <View className="bg-gray-50 rounded-2xl px-6 py-4 my-1 shadow-md">
      <Text className="text-base font-bold text-gray-900">
        Cancellation Policy
      </Text>
      <Text className="text-xs text-gray-700 mt-2 ">
        Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
      </Text>
    </View>
  );
};

export default CancellationPolicy;
