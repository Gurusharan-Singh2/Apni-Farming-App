import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Convert 24-hour format to 12-hour format with AM/PM
const formatTo12Hour = (timeStr) => {
  const [hour, minute] = timeStr.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
};

// Check if slot time is in the past (today only)
const isPastTime = (dateStr, timeStr) => {
  const [h, m, s] = timeStr.split(':').map(Number);
  const now = new Date();
  const slotDate = new Date(dateStr);
  slotDate.setHours(h, m, s || 0);

  const isToday = now.toDateString() === slotDate.toDateString();
  return isToday && now > slotDate;
};

const DeliverySlotSelector = ({ slots, selectedDate, selectedSlotId, onSelect }) => {
  if (!selectedDate) {
    return (
      <View className="mb-6 px-6">
        <Text className="text-basic text-gray-500">Please select a date first</Text>
      </View>
    );
  }

  const availableSlots = slots.filter(slot => {
    const now = new Date();
    const [h, m] = slot.start_time.split(':').map(Number);
    const slotDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      h,
      m
    );
    return slotDateTime > now;
  });

  return (
    <View className="mb-6 px-6">
      <Text className="text-heading-small font-semibold text-gray-900 mb-3">
        🚚 Available Delivery Slots
      </Text>

      {availableSlots.length === 0 ? (
        <Text className="text-basic text-gray-500">
          {slots.length === 0 
            ? "No delivery slots available" 
            : "All slots for selected date have passed. Please choose another date."}
        </Text>
      ) : (
        <View className="flex-row justify-between flex-wrap gap-3">
          {availableSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              onPress={() => onSelect(slot.id)}
              className={`rounded-xl px-4 max-w-[30%] py-3 border-2 ${
                selectedSlotId === slot.id 
                  ? 'border-green-600 bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <View className="flex-row justify-around items-center">
                <View>
                  <Text className="text-basic font-medium text-black">
                    {slot.title}
                  </Text>
                  <Text className="text-basic text-gray-600">
                    {formatTo12Hour(slot.start_time)} - {formatTo12Hour(slot.end_time)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default DeliverySlotSelector;
