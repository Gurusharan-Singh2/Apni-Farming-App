import { View, Alert, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import SearchBar from "../../components/SearchBar";
import LocationIcon from "../../components/LocationIcon";
import Products from "../../components/Products";
import BannerCarousel from "../../components/Banner";
import CategoryItem from "../../components/Item_Category";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [query, setQuery] = useState("");
  
 const [categoryId, setCategoryId] = useState('0');


const {
  data,
  isLoading,
  isError,
  isFetching,
  refetch,
} = useQuery({
  queryKey: ['products', categoryId],
  queryFn: async () => {
    const url =
      categoryId === '0'
        ? 'https://apni-farming-backend.onrender.com/api/products'
        : `https://apni-farming-backend.onrender.com/api/categories/${categoryId}/products`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    return res.json();
  },
});



// banners
// banners
const {
  data: banners,
  isLoading: bannersLoading,
  isError: bannersError,
  refetch: refetchBanners,
} = useQuery({
  queryKey: ["banners"],
  queryFn: async () => {
    const res = await fetch("https://apni-farming-backend.onrender.com/api/banner");
    if (!res.ok) throw new Error("Banner fetch error");
    return res.json();
  },
});





  const handleSearch = (text) => {
    setQuery(text);
    Alert.alert("Search submitted", `You searched for "${text}"`);
  };
  
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
      <View className="flex flex-row w-full justify-between px-6 my-3">
        <LocationIcon />
        <View className="w-10 h-10 rounded-full border items-center justify-center">
          <Ionicons name="person-outline" size={20} color="black" />
        </View>
      </View>

      <Products
       data={data}
       loading={isLoading}
       error={isError}
         refreshing={isFetching}
  onRefresh={refetch}
       
        ListHeaderComponent={
          <>
            <SearchBar query={query} onChange={setQuery} onSubmit={handleSearch} />
            <BannerCarousel
  banners={banners}
  isLoading={bannersLoading}
  isError={bannersError}
/>

            <CategoryItem setCategoryId={setCategoryId}
             />
          </>
        }
      />
    </SafeAreaView>
  );
}
