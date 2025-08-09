import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/Colors";
import CartIconWithBadge from "../../components/Carticon";
import EmptyCart from "../../components/EmptyCart";
import ProfileIcon from "../../components/ProfileIcon";
import WishListItem from "../../components/WishListItem";
import useAuthStore from "../../Store/AuthStore";
import useWishlistStore from "../../Store/WishlistStore";
import EmptyWishlist from "../../components/EmptyWishlist";
import BuyitAgain from "../../components/BuyitAgain";

export default React.memo(function Wishlist() {
  const { wishlist } = useWishlistStore();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const renderItem = useCallback(({ item }) => <WishListItem item={item} />, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
      <View className="mb-1">
        <View className="flex flex-row w-full justify-between px-6 my-3">
          <View className="flex-row items-center  py-3 bg-white">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center w-40 gap-3"
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text className="text-heading-big">Wishlist</Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row items-center gap-2">
            <CartIconWithBadge />
            {isAuthenticated() && <ProfileIcon />}
          </View>
        </View>
      </View>
      {wishlist.length === 0 &&(<View className="h-[80%]"><EmptyWishlist />  <View className="mt-14">
        <BuyitAgain 
                url={"https://api.apnifarming.com/user/products/buyitagain.php"}
                title={"Buy it Again"}
                method={"post"}
                objKey={"products"}
              />
              </View></View> )}
      <FlatList data={wishlist} renderItem={renderItem} />
    </SafeAreaView>
  );
});
