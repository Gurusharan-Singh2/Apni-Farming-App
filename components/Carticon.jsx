import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useCartStore from "../Store/CartStore";
import { useRouter } from "expo-router";

const CartIconWithBadge = () => {
 const { totalItems } = useCartStore();
  
  const router = useRouter();
  return (
    <View className="relative p-1">
      <TouchableOpacity onPress={() => router.push("/cart")}>
         <MaterialCommunityIcons name="cart-variant" size={28} color="black" />
      {totalItems > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[16px] h-[16px] px-1 items-center justify-center">
          <Text className="text-white text-[10px] font-bold">
            {totalItems > 99 ? "99+" : totalItems}
          </Text>
        </View>
      )}
      </TouchableOpacity>
     
    </View>
  );
};

export default CartIconWithBadge;
