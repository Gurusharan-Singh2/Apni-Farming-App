import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/Colors";
import BannerCarousel from "../../components/Banner";
import CategoryItem from "../../components/Item_Category";
import LocationIcon from "../../components/LocationIcon";
import Products from "../../components/Products";
import SearchBar from "../../components/SearchBar";
import ProfileIcon from "../../components/ProfileIcon";

import useNotifications, { registerNotifeeListeners } from "../../hooks/useNotifications";
import useAuthStore from "../../Store/AuthStore";
import { useRouter } from "expo-router";
import { handleBackgroundNotificationNavigation } from "../../utils/notification";
import CartIconWithBadge from "../../components/Carticon";
import {  BackendUrl2 } from "../../utils/Constants";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();


  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("0");
  

  useEffect(() => {
    registerNotifeeListeners();
    handleBackgroundNotificationNavigation(router);
  }, []);

  useNotifications();

  // Fetch products
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    isFetching: productsFetching,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      const url =
        categoryId === "0"
          ? `${BackendUrl2}/user/products/getAllProducts.php`
          // : `${BackendUrl}/api/categories/${categoryId}/products`;l̥
          : `${BackendUrl2}/user/categories/getProductsByCategory.php?id=${categoryId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network error");
     
      
      return res.json();
    },
  });
  // console.log(products);
  

  // Fetch banners
  const {
    data: banners,
    isLoading: bannersLoading,
    isError: bannersError,
    refetch: refetchBanners,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      // const res = await fetch(`${BackendUrl}/api/banner`);
      const res = await fetch(`${BackendUrl2}/user/banner/getAllBanners.php`);
      if (!res.ok) throw new Error("Banner fetch error");
      
      
      return res.json();
    },
  });

  
  

  // Pull-to-refresh: refetch both products and banners
  const handleRefresh = async () => {
    await Promise.all([refetchProducts(), refetchBanners()]);
  };

  const handleSearch = (text) => {
    setQuery(text);
    Alert.alert("Search submitted", `You searched for "${text}"`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY , paddingBottom:-40 }}>
      <View className="mb-1"> 
      <View className="flex flex-row w-full justify-between px-6 my-3">
        <LocationIcon />
        <View className="flex flex-row items-center gap-2">
        <CartIconWithBadge/>
{isAuthenticated() && <ProfileIcon />}
        </View>
        </View>
         <SearchBar
              query={query}
              onChange={setQuery}
              onSubmit={handleSearch}
            />
      </View>

      <Products
        data={products}
        loading={productsLoading}
        error={productsError}
        refreshing={productsFetching || bannersLoading}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <>
           
            <BannerCarousel
              banners={banners}
              
              isLoading={bannersLoading}
              isError={bannersError}
            />
            <CategoryItem setCategoryId={setCategoryId} />
          </>
        }
      />
    </SafeAreaView>
  );
}
