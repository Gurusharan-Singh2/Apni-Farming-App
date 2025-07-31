import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import CartIconWithBadge from "../../../components/Carticon";
import ProfileIcon from "../../../components/ProfileIcon";
import useAuthStore from "../../../Store/AuthStore";
import { BackendUrl2 } from "../../../utils/Constants";
import CategoyComponentCard from "../../../components/categories/CatoryComponentCard";
import EmptyCart from "../../../components/EmptyCart";

const fetchProductsByCategory = async (categoryId) => {
   const url =
        categoryId === "0"
          ? `${BackendUrl2}/user/products/getAllProducts.php`
          // : `${BackendUrl}/api/categories/${categoryId}/products`;l̥
          : `${BackendUrl2}/user/categories/getProductsByCategory.php?id=${categoryId}`;

  const res = await axios.get(url);
  if (!Array.isArray(res.data)) throw new Error("Invalid product response");
  return res.data;
};

const fetchCategories = async () => {
  const { data } = await axios.get(
    `${BackendUrl2}/user/categories/getAllCategories.php`
  );
   return [{ id: '0', name: 'All', image: 'https://jobdsco.s3.ap-south-1.amazonaws.com/public/s550_4xb7_231012.jpg' }, ...data]
};

const index = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [selectedCategoryId, setSelectedCategoryId] = useState('0');
  useEffect(()=>{
    setSelectedCategoryId(id)
  },[id])


  const {
    data: categories,
    isLoading: loadingCategories,
    error: errorCategories,
  } = useQuery({
  queryKey: ["allCategories"],
  queryFn: fetchCategories,
});

  const {
    data: products,
    isLoading: loadingProducts,
    error: errorProducts,
  } = useQuery({
  queryKey: ["categoriesProducts", selectedCategoryId],
  queryFn: () => fetchProductsByCategory(selectedCategoryId),
  enabled: !!id,
});

  const handleCategoryPress = (categoryId) => {
    setSelectedCategoryId(categoryId);
    
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex flex-row justify-between px-6 my-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center w-40 gap-3"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-heading-big">Back</Text>
        </TouchableOpacity>
        <View className="flex flex-row items-center gap-2">
          <CartIconWithBadge />
          {isAuthenticated() && <ProfileIcon />}
        </View>
      </View>

     

      {/* Main Content */}
      <View className=" flex-1 flex-row">
        {/* Sidebar Categories */}
        <ScrollView className="max-w-24 border-r border-gray-200 bg-[#f9f9f9]">
          {loadingCategories ? (
            <ActivityIndicator size="small" color="green" className="mt-4" />
          ) : errorCategories ? (
            <Text className="text-red-500 text-xs text-center mt-2">
              Failed to load categories
            </Text>
          ) : (
            categories?.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleCategoryPress(cat.id)}
                className={`p-3 items-center ${
                  selectedCategoryId === cat.id ? "bg-[#e0ffe0]" : ""
                }`}
              >
                <Image
                  source={{
                    uri:
                      cat.image ||
                      "https://via.placeholder.com/50x50.png?text=No+Image",
                  }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                  resizeMode="contain"
                />
                <Text
                  className="text-[13px]  text-center mt-1"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {cat.name || "Unnamed"}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Product Grid */}
        <View className="flex-1 p-1">
          {loadingProducts ? (
            <ActivityIndicator size="large" color="green" />
          ) : errorProducts ? (
            <Text className="text-red-500">Failed to load products</Text>
          ) : products.length===0 ? (
              <EmptyCart/>

          ): (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{
                gap:1,
                paddingBottom: 10,
                justifyContent: "flex-start",
              }}
              contentContainerStyle={{ paddingBottom: 20,paddingLeft:0 }}
              renderItem={({ item }) => <CategoyComponentCard item={item} />}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default index;
