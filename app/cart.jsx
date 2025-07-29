// ⬅️ Your imports remain the same
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import useCartStore from '../Store/CartStore';
import { Colors } from '../assets/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import useAuthStore from '../Store/AuthStore';
import EmptyCart from '../components/EmptyCart';
import BuyitAgain from '../components/BuyitAgain';
import { BackendUrl2 } from '../utils/Constants';
import CartIconWithBadge from '../components/Carticon';
import ProfileIcon from '../components/ProfileIcon';
import EmptyOrder from '../components/EmptyOrder';

const CartScreen = () => {
  const { cart, discount, finalAmount, decrement, increment } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const renderItem = ({ item }) => (
    <View className="flex-row gap-3 mt-3 bg-white p-2 border-b border-b-gray-100 shadow">
      <View className="flex-row items-center border border-gray-200 p-1 rounded-lg">
        <Image className="w-28 h-28 rounded-lg" source={{ uri: item.image }} />
      </View>

      <View>
        <Text className="text-heading-small text-gray-600 font-semibold">{item.name}</Text>
        <Text className="text-basic text-gray-400 font-semibold">
          {item.selectedSize?.size} {item.selectedSize?.option}
        </Text>

        <View className="flex-row gap-24 justify-between items-end mt-2">
          <View className="w-14">
            <Text className="text-heading-small text-black font-extrabold">
              ₹ {item.selectedSize?.sellPrice}
            </Text>
            <Text className="text-basic line-through text-gray-500 font-semibold">
              ₹{item.selectedSize?.costPrice}
            </Text>
          </View>

          <View>
            <View className="flex-row items-center justify-between bg-green-600 rounded-lg px-3 py-1 w-[100px]">
              <TouchableOpacity onPress={() => decrement(item.id, item.selectedSize?.id)}>
                <Ionicons name="remove" size={22} color="#fff" />
              </TouchableOpacity>

              <Text className="text-basic font-semibold text-white">{item.quantity}</Text>

              <TouchableOpacity onPress={() => increment(item.id, item.selectedSize?.id)}>
  <Ionicons name="add" size={22} color="#fff" />
</TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => `${item.id}-${item.selectedSize?.size}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            ListHeaderComponent={() => (
              <>
               <View className="mb-1">
        <View className="flex flex-row w-full justify-between px-6 my-3">
          <View className="flex-row items-center py-3 bg-white">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center w-40 gap-3"
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text className="text-heading-big">Back</Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row items-center gap-2">
            <CartIconWithBadge />
            {isAuthenticated() && <ProfileIcon />}
          </View>
        </View>
      </View>
                
                

                {cart.length === 0 && (
                <>
                   <EmptyOrder/>
                   <BuyitAgain url={`${BackendUrl2}/user/products/getAllProducts.php`} title={"Get Start Shopping"}/>
                </>
                )}
              </>
            )}
          />

          {cart.length > 0 && (
            <View className="bg-white px-4 py-2  shadow-lg border-t border-gray-200">
              <View className="flex flex-col gap-1 items-start">
                <Text className="font-extrabold text-heading-small">Total: ₹ {finalAmount}</Text>

                <View className="flex-row bg-green-100 p-1 items-center">
                  <AntDesign name="tags" size={18} color="#22c55e" />
                  <Text className="text-green-500 text-basic font-semibold ml-1">
                    Saved ₹{discount}
                  </Text>
                </View>
              </View>

              <View className="mt-2">
                {isAuthenticated() ? (
                  <TouchableOpacity
                    className="bg-green-600 px-5 py-5 rounded-lg"
                    onPress={() => router.push('/order')}
                  >
                    <Text className="text-white font-semibold text-heading-big">Go to Checkout</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="bg-green-600 px-5 py-5 rounded-lg"
                    onPress={() => router.push('/signin')}
                  >
                    <Text className="text-white font-semibold text-heading-big">Login</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CartScreen;
