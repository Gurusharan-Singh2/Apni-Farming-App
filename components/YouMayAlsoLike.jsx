import axios from "axios";
import React, { useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    View
} from "react-native";
import Toast from "react-native-toast-message";

import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../Store/AuthStore";
import useCartStore from "../Store/CartStore";
import SuggestionCard from "./SuggestionCard";

const YouMayAlsoLike = ({ url, title }) => {
  const { user } = useAuthStore();
  const customer_id = user?.userId;

  const { cart } = useCartStore();

  const YouMAyAlsoLikeFetch = async () => {
    const res = await axios.post(url, {
      uid: customer_id,
      cart,
    });

    return res?.data?.data ?? [];
  };

  const { data: ypumayalso, isLoading } = useQuery({
    queryKey: ["ypumayalso", customer_id],
    queryFn: YouMAyAlsoLikeFetch,
    
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
    enabled: !!customer_id,
    retry: 2,
    retryDelay: 5 * 1000,
  });

  const renderItem = useCallback(({ item }) => <SuggestionCard item={item} />, []);

  return (
    <View className="py-2 mt-4">
      <Text className="text-lg font-bold px-4 mb-4">{title}</Text>

      {isLoading ? (
        <View className="flex-1 justify-center items-center h-32">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={ypumayalso}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default React.memo(YouMayAlsoLike);
