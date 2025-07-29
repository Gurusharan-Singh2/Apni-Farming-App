import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { useQuery } from "@tanstack/react-query";
import SuggestionCard from "./SuggestionCard";

const CartReccomendation = ({ url, title }) => {
  const {
    data: products,
    isLoading,
  } = useQuery({
    queryKey: ["cartRecomnedation"],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network error");

      return res.json();
    },
    onError: (error) => {
      console.error("Error fetching Buy it again:", error.message);
      Toast.show({
        type: "error",
        text1: "Failed to load Buy it again",
        text2: error.message,
        visibilityTime: 1000,
        autoHide: true,
      });
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 5 * 1000,
  });

  return (
    <View className="py-2 mt-4">
      <Text className="text-lg font-bold px-4 mb-4">{title}</Text>

      {isLoading ? (
        <View className="flex-1 justify-center items-center h-32">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => <SuggestionCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default CartReccomendation;
