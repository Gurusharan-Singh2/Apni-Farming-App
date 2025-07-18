import React from "react";
import { View, FlatList, RefreshControl, Text } from "react-native";
import ProductCard from "./ProductCard";
import useAuthStore from "../Store/AuthStore";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BackendUrl } from "../utils/Constants";

export default function Products({
  ListHeaderComponent,
  data = [],
  loading,
  error,
  refreshing,
  onRefresh,
}) {
  const { user } = useAuthStore();
  const customer_id = user?.userId;

  const {
    data: wishlistData = [],
    isLoading: wishlistLoading,
  } = useQuery({
    queryKey: ['wishlist', customer_id],
    queryFn: async () => {
      const res = await axios.get(`${BackendUrl}/api/wishlists/${customer_id}`);
      return res.data.map(item => item.product_id); // Only product IDs
    },
    enabled: !!customer_id,
  });

  if (loading && !refreshing) {
    return <Text className="px-5 py-4">Loading products...</Text>;
  }

  if (error) {
    return <Text className="px-5 text-red-500 py-4">Failed to load products</Text>;
  }

  return (
    <FlatList
      data={data}
      numColumns={2}
      renderItem={({ item }) => (
        <ProductCard item={item}  />
      )}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12 }}
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#10b981"]}
        />
      }
    />
  );
}
