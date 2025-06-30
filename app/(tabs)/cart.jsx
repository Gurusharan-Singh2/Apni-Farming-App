import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import useCartStore from '../../Store/CartStore';
import LocationIcon from '../../components/LocationIcon';
import { Colors } from '../../assets/Colors';

const CartScreen = () => {
  const {
    cart,
    increment,
    decrement,
    removeFromCart,
    clearCart,
  } = useCartStore();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = totalAmount > 1000 ? 100 : 0;
  const finalAmount = totalAmount - discount;

  const handleOrder = () => {
    if (!name || !mobile) {
      Alert.alert('Incomplete Info', 'Please enter your name and mobile number.');
      return;
    }

    Alert.alert('Order Placed', `Thanks ${name}, your order has been placed!`);
    clearCart();
    setName('');
    setMobile('');
  };

  const renderItem = ({ item }) => (
    <View className="flex-row justify-between items-center mb-3 bg-white p-3 rounded-xl shadow">
     <Text className="text-sm text-gray-700 font-semibold">
  {item.name} ({item.selectedSize?.size})
</Text>

<Text className="text-sm text-green-600 font-bold">
  ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
</Text>

      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => decrement(item.id, item.selectedSize?.size)}>
          <Text className="px-2 text-lg">−</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => increment(item.id, item.selectedSize?.size)}>
          <Text className="px-2 text-lg">+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeFromCart(item.id, item.selectedSize?.size)}>
          <Text className="px-2 text-red-500">🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={cart}
          keyExtractor={(item, index) => `${item.id}-${item.selectedSize?.size}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListHeaderComponent={() => (
            <>
              <View className="flex flex-row w-full justify-between px-2 mb-4">
                <LocationIcon />
                <View className="w-10 h-10 rounded-full border items-center justify-center">
                  <Ionicons name="person-outline" size={20} color="black" />
                </View>
              </View>

              <Text className="text-xl font-bold mb-4">🛒 Your Cart</Text>

              {cart.length === 0 && (
                <Text className="text-center text-gray-500 mt-20">
                  Your cart is empty 🛒
                </Text>
              )}
            </>
          )}
          ListFooterComponent={() =>
            cart.length > 0 && (
              <>
                {/* Offer Section */}
                <View className="bg-yellow-100 p-3 rounded-xl mt-4">
                  <Text className="text-yellow-800 font-semibold">
                    🎉 Special Offer: ₹100 OFF on orders above ₹1000!
                  </Text>
                </View>

                {/* Order Summary */}
                <View className="bg-white mt-4 p-4 rounded-xl shadow">
                  <Text className="font-semibold text-lg mb-2">Order Summary</Text>
                  <Text>Total: ₹{totalAmount}</Text>
                  <Text>Discount: ₹{discount}</Text>
                  <Text className="font-bold mt-2">Final: ₹{finalAmount}</Text>
                </View>

                {/* Order Form */}
                <View className="mt-4">
                  <Text className="font-semibold text-base mb-2">Enter your details</Text>
                  <TextInput
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    className="bg-white p-3 rounded-xl mb-3"
                  />
                  <TextInput
                    placeholder="Mobile Number"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="phone-pad"
                    className="bg-white p-3 rounded-xl mb-3"
                  />
                </View>

                <TouchableOpacity
                  className="bg-green-600 py-3 rounded mt-4"
                  onPress={handleOrder}
                >
                  <Text className="text-white text-center font-bold">📦 Place Order</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-500 py-3 rounded mt-2"
                  onPress={clearCart}
                >
                  <Text className="text-white text-center font-bold">🧹 Clear Cart</Text>
                </TouchableOpacity>
              </>
            )
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CartScreen;
