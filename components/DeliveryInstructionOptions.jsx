import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Entypo, MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

const OPTIONS = [
  {
    id: "door",
    label: "Leave at Door",
    icon: (color) => <Entypo name="door" size={24} color={color} />,
  },
  {
    id: "hand",
    label: "Hand it to Me",
    icon: (color) => <MaterialIcons name="emoji-people" size={24} color={color} />,
  },
  {
    id: "call",
    label: "Call on Arrival",
    icon: (color) => <Ionicons name="call-outline" size={24} color={color} />,
  },
  {
    id: "security",
    label: "Leave with Security",
    icon: (color) => <FontAwesome5 name="shield-alt" size={20} color={color} />,
  },
];

const DeliveryInstructionOptions = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (id) => {
    setSelectedOption(id);
    onChange?.(id);
  };

  return (
    <View className="bg-white rounded-2xl p-4 my-4 shadow-sm">
      <Text className="text-base font-semibold text-gray-900 mb-4">
        Delivery Instructions
      </Text>

      <View className="flex-row flex-wrap justify-between gap-3">
        {OPTIONS.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const borderColor = isSelected ? "border-green-500" : "border-gray-300";
          const bgColor = isSelected ? "bg-green-50" : "bg-gray-100";
          const textColor = isSelected ? "text-green-700" : "text-gray-700";
          const iconColor = isSelected ? "#059669" : "#6B7280";

          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => handleSelect(opt.id)}
              className={`w-[47%] items-center justify-center border ${borderColor} ${bgColor} rounded-xl py-4`}
            >
              {opt.icon(iconColor)}
              <Text className={`mt-2 text-sm font-medium text-center ${textColor}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default DeliveryInstructionOptions;
