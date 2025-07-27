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
      columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 6, paddingTop:10 }}
      contentContainerStyle={{ paddingBottom:"auto", paddingTop: 10 }}
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
