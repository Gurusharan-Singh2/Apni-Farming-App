import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Back({ title = "Back", onPress }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center py-3 bg-white">
      <TouchableOpacity
        onPress={onPress || (() => router.back())}
        className="flex-row items-center w-40 gap-3"
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text className="text-heading-big">{title}</Text>
      </TouchableOpacity>
    </View>
  );
}
