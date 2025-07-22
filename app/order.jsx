import React, { useEffect, useState,useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Coupon from '../components/Coupon';
import ChangedAddress from '../components/ChangeAddress';
import useCartStore from '../Store/CartStore';
import useAddressStore from '../Store/useAddressStore';
import { useMutation } from '@tanstack/react-query';
import DeliverySlotSelector from '../components/DeliverySlotSelector';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


const OrderScreen = () => {
  const router = useRouter();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    cart,
    totalAmount,
    discount,
    finalAmount,
    couponDiscount,
    removeCoupon,
    deliveryCharge,
    gstAmount,
    couponCode,
  } = useCartStore();

  const { selectedAddress } = useAddressStore();
const ApplyCouponMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post('https://api.apnifarming.com/user/coupon/apply.php', payload);
      return res.data;
    },
  });

    const isMounted = useRef(false);
  

 useEffect(() => {
    isMounted.current = true;

  const fetchTimeSlots = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://api.apnifarming.com/user/checkout/slots.php?subtotal=${finalAmount}`
      );
      if (res.data.success) {
        setTimeSlots(res.data.data);
        // Update delivery charges from API if needed
        useCartStore.getState().applyChargesFromBackend({
          delivery_charge: parseFloat(res.data.deliverycharge || 0),
          gst: parseFloat(res.data.tax || 0),
        });

      }
      if (couponCode) {
          const payload = { code: couponCode, cart_total: finalAmount };
          const data = await ApplyCouponMutation.mutateAsync(payload);
          if (data.status === 'success') {
            useCartStore.getState().applyCouponFromBackend(data.data);
          } else {
            useCartStore.getState().removeCoupon();
            if (isMounted.current) {
              Toast.show({
                type: 'error',
                text1: 'Coupon Removed',
                text2: data?.error || 'Coupon is invalid or expired',
              });
            }
          }
        }
    } catch (error) {
        useCartStore.getState().removeCoupon();
    Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load slots/coupons' });
    } finally {
      setIsLoading(false);
    }
  };

    fetchTimeSlots();

    return () => {
      isMounted.current = false;
    };
  }, []);
  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setSelectedSlotId(null); 
    setDatePickerVisibility(false);
  };

  const handleCheckout = () => {
    if (!selectedSlotId) {
      Toast.show({
        type: 'error',
        text1: 'Selection Required',
        text2: 'Please select a delivery slot',
      });
      return;
    }

    if (!selectedAddress) {
      Toast.show({
        type: 'error',
        text1: 'Address Required',
        text2: 'Please select a delivery address',
      });
      return;
    }

    const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId);

    console.log(
      {
        selectedDate,
        selectedSlotId,
         cart,
      selectedAddress,
      totalAmount,
      deliveryCharge,
      couponDiscount,
      discount

      
      }
    );
    
    

  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="flex-row items-center w-44 gap-3"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-heading-big font-semibold">Checkout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
          <Coupon />
        <View className="mb-1 px-6">
          <Text className="text-heading-big font-bold text-black mb-2 mt-4">Order Summary</Text>
          <View className="bg-white rounded-lg pb-4 border-b border-b-gray-100 mb-4">
            <Text className="text-heading-small font-semibold text-gray-800 mb-1">Delivery Address</Text>
            {selectedAddress ? (
              <>
                <Text className="text-gray-700 mb-1 text-basic">{selectedAddress.title}</Text>
                <Text className="text-gray-700 mb-1 text-basic">{selectedAddress.street}</Text>
                <Text className="text-gray-700 mb-3 text-basic">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}</Text>
                <ChangedAddress />
              </>
            ) : (
              <TouchableOpacity onPress={() => router.push('/address-selection')}>
                <Text className="text-blue-500">Add Delivery Address</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
<View className="mb-2 px-6">
  <Text className="text-heading-small font-semibold text-gray-800 mb-2">Delivery Date</Text>

  <TouchableOpacity
    className="flex-row items-center justify-between border border-gray-300 bg-white px-2 py-2 rounded-xl shadow-lg"
    onPress={() => setDatePickerVisibility(true)}
    activeOpacity={0.8}
  >
    <Text className="text-basic text-gray-500">
      {selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </Text>

    <Feather name="calendar" size={22} color="#4B5563" />
  </TouchableOpacity>

  <DateTimePickerModal
    isVisible={isDatePickerVisible}
    mode="date"
    minimumDate={new Date()}
    onConfirm={handleDateConfirm}
    onCancel={() => setDatePickerVisibility(false)}
  />
</View>

        {/* Time Slot Selection */}
        {isLoading ? (
          <View className="p-4 items-center">
            <Text className="text-basic text-gray-500">Loading available slots...</Text>
          </View>
        ) : (
          <DeliverySlotSelector
            slots={timeSlots}
            selectedDate={selectedDate}
            selectedSlotId={selectedSlotId}
            onSelect={setSelectedSlotId}
          />
        )}

        {/* Order Summary */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text className="text-heading font-bold text-black mb-4">Order Summary</Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-basic text-gray-600">Subtotal</Text>
              <Text className="text-basic font-medium">₹{totalAmount.toFixed(2)}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-basic text-gray-600">Discount</Text>
              <Text className="text-basic text-green-600">-₹{discount.toFixed(2)}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-basic text-gray-600">Delivery</Text>
              <Text className="text-basic">
                {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-basic text-gray-600">GST</Text>
              <Text className="text-basic">₹{gstAmount.toFixed(2)}</Text>
            </View>
            
            <View className="border-t border-gray-200 pt-3 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-basic font-bold">Total</Text>
                <Text className="text-basic font-bold">₹{finalAmount.toFixed(2)}</Text>
              </View>
              <Text className="text-basic text-green-600 mt-1">
                You saved ₹{(discount + couponDiscount).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleCheckout}
          disabled={!selectedSlotId || !selectedAddress}
          className={`bg-green-600 rounded-lg flex-row justify-between py-4 px-6 items-center ${
            (!selectedSlotId || !selectedAddress) ? 'opacity-50' : ''
          }`}
        >
          <Text className="text-white font-bold text-lg">Proceed to Payment</Text>
          <Text className="text-white text-sm mt-1">
            ₹{finalAmount.toFixed(2)} 
          </Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

export default OrderScreen;