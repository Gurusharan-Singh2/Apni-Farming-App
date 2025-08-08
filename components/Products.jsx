import React, { useCallback } from "react";
import { FlatList, RefreshControl, Text } from "react-native";
import ProductCard from "./ProductCard";

function Products({
  ListHeaderComponent,
  data = [],
  loading,
  error,
  refreshing,
  onRefresh,
}) {
  const renderItem = useCallback(({ item }) => <ProductCard item={item} />, []);

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
      renderItem={renderItem}
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
      initialNumToRender={8}
      windowSize={7}
      maxToRenderPerBatch={8}
      removeClippedSubviews={true}
    />
  );
}

export default React.memo(Products);
