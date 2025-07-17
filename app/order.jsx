import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Coupon from '../components/Coupon';
import useCartStore from '../Store/CartStore';
import useAddressStore from '../Store/useAddressStore';
import ChangedAddress from '../components/ChangeAddress';
import DeliveryInstructionOptions from '../components/DeliveryInstructionOptions';

const OrderScreen = () => {
  const { cart, totalAmount, discount, finalAmount } = useCartStore();
  const { selectedAddress } = useAddressStore();
  const router = useRouter();

  const handleCheckout = () => {
    // Add your checkout logic here
    console.log('Proceeding to checkout');
    // router.push('/payment'); // Uncomment to navigate to payment screen
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="flex-row items-center space-x-2"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-lg">Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content with ScrollView */}
      <ScrollView 
        className="flex-1 px-4" 
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Coupon />

        <View className="mb-6">
          <Text className="text-2xl font-bold text-black mb-4 mt-4">Order Summary</Text>
          
          {/* Address Section */}
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Delivery Address</Text>
            {selectedAddress ? (
              <View>
                <Text className="text-gray-700">{selectedAddress.name}</Text>
                <Text className="text-gray-700">{selectedAddress.street}</Text>
                <Text className="text-gray-700">
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}
                </Text>
               <ChangedAddress/>
              </View>
            ) : (
              <TouchableOpacity onPress={() => router.push('/address-selection')}>
                <Text className="text-blue-500">Add Delivery Address</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Order Items Section */}
          <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Your Order</Text>
            {cart.map((item, index) => (
              <View 
                key={index} 
                className="flex-row justify-between items-center py-3 border-b border-gray-200"
              >
                <Text className="text-gray-700">
                  {item.name} × {item.quantity}
                </Text>
                <Text className="text-black font-semibold">₹ {item.costPrice * item.quantity}</Text>
              </View>
            ))}
          </View>
        </View>
         <DeliveryInstructionOptions />

        {/* Payment Details */}
        <View className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <Text className="text-xl font-extrabold text-black mb-4">Payment Details</Text>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
            <Text className="text-gray-600">MRP Total:</Text>
            <Text className="text-black font-semibold">₹ {totalAmount}</Text>
          </View>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
            <Text className="text-gray-600">Product Discount:</Text>
            <Text className="text-green-500 font-semibold">₹ -{discount}</Text>
          </View>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
            <Text className="text-gray-600">Coupon Discount:</Text>
            <Text className="text-green-500 font-semibold">₹ 0</Text>
          </View>
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
            <Text className="text-gray-600">Delivery Charges:</Text>
            <Text className="text-green-500 font-semibold">FREE</Text>
          </View>
          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-gray-600">Total Amount:</Text>
            <View className="flex items-end">
              <Text className="text-black text-xl font-extrabold">₹ {finalAmount}</Text>
              <Text className="text-green-500 font-extrabold">You Saved ₹ {discount}</Text>
            </View>
          </View>
        </View>
       
      </ScrollView>

      {/* Fixed Checkout Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <TouchableOpacity 
          className={`bg-green-600 rounded-lg py-4 px-6 flex-row justify-between items-center ${
            !selectedAddress ? 'opacity-50' : ''
          }`}
          onPress={handleCheckout}
          disabled={!selectedAddress}
        >
          <Text className="text-white font-bold text-lg">Proceed to Payment</Text>
          <Text className="text-white font-bold text-lg">₹ {finalAmount}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderScreen;