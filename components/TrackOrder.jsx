import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../assets/Colors';

const stepsDefault = [
  { key: 'orderProcessed', label: 'Order Processed', icon: 'document-text-outline' },
  { key: 'orderConfirmed', label: 'Order Confirmed', icon: 'checkmark-circle-outline' },
  { key: 'outForDelivery', label: 'Out for Delivery', icon: 'bicycle-outline' },
  { key: 'delivered', label: 'Delivered', icon: 'home-outline' },
  { key: 'refunded', label: 'Refunded', icon: 'cash-outline' },
  { key: 'cancelled', label: 'Cancelled', icon: 'close-circle-outline' },
];


const TrackOrder = ({
  currentStep = 0,
  steps = stepsDefault,
}) => {
  // Get the current step key
  const currentStepKey = steps[currentStep]?.key;

  let filteredSteps = steps;
  if (currentStepKey === 'delivered' || currentStepKey === 'refunded' || currentStepKey === 'cancelled') {
    filteredSteps = steps.filter(step => step.key !== 'refunded' && step.key !== 'cancelled');
  }
 
  
  

  // If order is cancelled, show only cancelled step
  if (currentStepKey === 'cancelled') {
    return (
      <View className="bg-white rounded-xl p-4 flex-row items-start mb-4">
        {/* Circle */}
        <View className="items-center mr-4">
          <View
            className="w-8 h-8 rounded-full border-2 items-center justify-center"
            style={{
              backgroundColor: '#ffe6e6',
              borderColor: 'red',
            }}
          >
            <Ionicons name="close-circle-outline" size={16} color="red" />
          </View>
        </View>

        {/* Label */}
        <View className="flex-1">
          <Text className="text-sm font-semibold" style={{ color: 'red' }}>
            Order Cancelled
          </Text>

          <Text className="text-xs mt-1" style={{ color: 'red', fontWeight: '600' }}>
            Your order has been cancelled.
          </Text>
        </View>
      </View>
    );
  }

  if (currentStepKey === 'refunded') {
  return (
    <View className="bg-white rounded-xl p-4 flex-row items-start mb-4">
      <View className="items-center mr-4">
        <View
          className="w-8 h-8 rounded-full border-2 items-center justify-center"
          style={{ backgroundColor: '#f3e6ff', borderColor: 'purple' }}
        >
          <Ionicons name="cash-outline" size={16} color="purple" />
        </View>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold" style={{ color: 'purple' }}>
          Order Refunded
        </Text>
        <Text className="text-xs mt-1" style={{ color: 'purple', fontWeight: '600' }}>
          Your order has been refunded.
        </Text>
      </View>
    </View>
  );
}

  // Normal steps flow if not cancelled
  return (
    <View className="bg-white rounded-xl p-4 ">
      {filteredSteps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <View key={step.key} className="flex-row items-start mb-6">
            {/* Left part: circle + line */}
            <View className="items-center mr-4">
              {/* Circle */}
              <View
                className="w-8 h-8 rounded-full border-2 items-center justify-center"
                style={{
                  backgroundColor: isCompleted || isActive ? Colors.PRIMARY : '#fff',
                  borderColor: isCompleted || isActive ? Colors.PRIMARY : '#ccc',
                }}
              >
                <Ionicons
                  name={step.icon}
                  size={16}
                  color={isCompleted || isActive ? '#fff' : '#999'}
                />
              </View>

              {/* Connector line */}
              {index !== filteredSteps.length - 1 && (
                <View
                  style={{
                    width: 2,
                    height: 40,
                    backgroundColor: index < currentStep ? Colors.PRIMARY : '#ccc',
                    marginTop: 2,
                  }}
                />
              )}
            </View>

            {/* Right part: labels */}
            <View className="flex-1">
              <Text
                className="text-sm font-semibold"
                style={{ color: isCompleted || isActive ? Colors.PRIMARY : '#666' }}
              >
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default memo(TrackOrder);
