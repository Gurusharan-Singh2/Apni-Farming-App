import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

const DeliveryInstructions = ({
  delivey_instruction,
  setdelivery_instruction,
}) => {
  const handleBlur = () => {
    if (delivey_instruction.trim()) {
      Toast.show({
        type: 'success',
        text1: 'Delivery instruction saved',
        visibilityTime: 600,
      });
    }
  };

  return (
    <View className="mb-1 px-6">
      <Text className="text-heading-small font-semibold text-gray-800 mb-2">
        Delivery Instructions
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-2 text-basic placeholder:text-gray-400"
        placeholder="e.g. Leave at the door, call before arrival..."
        value={delivey_instruction}
        onChangeText={setdelivery_instruction}
        onBlur={handleBlur} // 👈 Trigger toast on losing focus
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>
  );
};

export default DeliveryInstructions;
