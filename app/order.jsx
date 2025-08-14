import React, { useEffect, useState, useRef, useMemo, useCallback, Suspense } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import useCartStore from '../Store/CartStore';
import useAddressStore from '../Store/useAddressStore';
import useAuthStore from '../Store/AuthStore';
import { useMutation } from '@tanstack/react-query';
import { toastConfig } from '../hooks/toastConfig';
import Coupon from '../components/Coupon'
import ChangedAddress from '../components/ChangeAddress'
import ThankYouCard from '../components/ThankYouCard'
import DeliveryInstructions from '../components/DeliveryInstruction'
import CancellationPolicy from '../components/cc'
import DeliverySlotSelector from '../components/DeliverySlotSelector';
import Back from '../components/Back';
import ZipCodeNotServiceableModal from '../components/orderError';


const OrderScreen = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryInstruction, setDeliveryInstruction] = useState('');
  const [paymentMethod] = useState('COD');
  const [thank, setThank] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [zipModalVisible, setZipModalVisible] = useState(false);
const [zipMessage, setZipMessage] = useState('');


  const {
    cart,
    totalAmount,
    discount,
    finalAmount,
    couponDiscount,
    deliveryCharge,
    gstAmount,
    couponCode,
  } = useCartStore();

  const { user, token } = useAuthStore();
  const { selectedAddress } = useAddressStore();

  const [timeSlots, setTimeSlots] = useState([]);
  const isMounted = useRef(false);

  const ApplyCouponMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post('https://api.apnifarming.com/user/coupon/apply.php', payload);
      return res.data;
    },
    onError: (error) => {
         console.log(error?.response?.data?.message);
         Toast.show({
           type: "error",
           text1: error?.response?.data?.message,
         });
       },
  });

 const CheckoutMutation = useMutation({
  mutationFn: async (payload) => {
    const res = await axios.post('https://api.apnifarming.com/user/checkout/submit.php', payload);
    
    
    return res.data;
  },
  onSuccess: (data) => {
    
    
    
    if (data.success && data.order_id) {
      setCreatedOrderId(data.order_id);
      setThank(true);
      useCartStore.getState().clearCart();
    } else {
      // If API returns ZIP not serviceable
      if (data?.success === false ) {
        
        
        setZipMessage(data?.zip);
        setZipModalVisible(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Order Failed',
          text2: data?.message || 'Please try again.',
        });
      }
    }
  },
  onError: (error) => {
    console.log(error);
    
    const success = error?.response?.data?.success;
    if (success === false ) {
      setZipMessage(error?.response?.data?.zip );
      setZipModalVisible(true);
    } else {
      Toast.show({
        type: "error",
        text1: message || 'Something went wrong',
      });
    }
  },
});


 const fetchTimeSlots = useCallback(async () => {
  setIsLoading(true);
  try {
    const res = await axios.get(
      `https://api.apnifarming.com/user/checkout/slots.php?subtotal=${finalAmount}`
    );

    const rawSlotsData = res?.data?.data;
    const parsedSlots =
      typeof rawSlotsData === 'string'
        ? JSON.parse(rawSlotsData)
        : rawSlotsData;

    const allSlots = Array.isArray(parsedSlots) ? parsedSlots : [];
    const now = new Date();

    const availableFutureSlots = allSlots.filter((slot) => {
      const [h, m] = slot.start_time.split(':').map(Number);
      const slotDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        h,
        m
      );
      return slotDateTime > now;
    });

    
    setTimeSlots(allSlots);
    

    useCartStore.getState().applyChargesFromBackend({
      delivery_charge: parseFloat(res.data.deliverycharge || 0),
      gst: parseFloat(res.data.tax || 0),
    });

  } catch (error) {
    console.log(error);
    Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load slots' });
  } finally {
    setIsLoading(false);
  }
}, [finalAmount]);

useEffect(()=>{
 if (timeSlots.length > 0 && !selectedSlotId){
 setSelectedSlotId(timeSlots[0].id); 
 }
},[timeSlots])

  useEffect(() => {
    isMounted.current = true;

    const validate = async () => {
      try {
        await useCartStore.getState().revalidateCoupon(ApplyCouponMutation);
      } catch {
        if (isMounted.current) {
          Toast.show({
            type: 'error',
            text1: 'Coupon Removed',
            text2: 'Something went wrong while validating the coupon',
          });
        }
      }
    };

    const timeout = setTimeout(() => {
      validate();
      fetchTimeSlots();
    }, 400);

    return () => {
      clearTimeout(timeout);
      isMounted.current = false;
    };
  }, [ finalAmount]);

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const handleCheckout = () => {
    if (!selectedSlotId || !selectedAddress || !user?.userId) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please complete address and slot selection.',
      });
      return;
    }

    const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId);


    const orderPayload = {
      user_token: token,
      user_id: user.userId,
      phone: user.phone,
      first_name: user.name,
      payment_method: paymentMethod,
      total_price: totalAmount,
      final_price: finalAmount,
      tax: gstAmount,
      shipping_price: deliveryCharge,
      coupon_code: couponCode || 'Not Selected',
      discount: couponDiscount,
      shipping_address: selectedAddress.street,
      shipping_city: selectedAddress.city,
      shipping_postalcode: selectedAddress.zip,
      delivery_date: selectedDate.toISOString().split('T')[0],
      delivery_from_time: selectedSlot.start_time,
      delivery_to_time: selectedSlot.end_time,
      shipping_state: selectedAddress.state,
      shipping_country: 'India',
      delivey_instruction: deliveryInstruction,
      order_items: cart.map(item => ({
        product_id: Number(item.id),
        product_name: item.name,
        product_qty: item.quantity,
        variant_name: item.selectedSize?.size + ' ' + item.selectedSize?.option || '',
        variant_id: item.selectedSize?.id,
        mrp: item.costPrice,
        sale_price: item.price,
      })),
    };
    
    

    CheckoutMutation.mutate(orderPayload);
  };

  
  

  const orderSummary = useMemo(() => ({
    subtotal: totalAmount.toFixed(2),
    discount: discount.toFixed(2),
    coupon: couponDiscount.toFixed(2),
    delivery: deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`,
    tax: gstAmount.toFixed(2),
    total: finalAmount.toFixed(2),
    savings: (discount + couponDiscount).toFixed(2),
  }), [totalAmount, discount, couponDiscount, deliveryCharge, gstAmount, finalAmount]);

  if (thank) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Suspense fallback={<ActivityIndicator />}>
          <ThankYouCard
            orderId={createdOrderId}
            onOrderMore={() => {
              setThank(false);
              router.replace('/home');
            }}
          />
        </Suspense>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
     <View className="mx-4 mt-1">
       <Back title="Back" />
     </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }}>
        <Suspense fallback={<ActivityIndicator />}>
          <Coupon />
        </Suspense>

        <View className="mb-1 px-6">
          <View className="bg-white rounded-lg pb-4 border-b border-b-gray-100 mb-4">
            <Text className="text-heading-small font-bold text-gray-900 mb-1">Delivery Address</Text>
            {selectedAddress ? (
              <>
                <Text className="text-gray-700 mb-1 text-basic">{selectedAddress.title}</Text>
                <Text className="text-gray-700 mb-1 text-basic">{selectedAddress.street}</Text>
                <Text className="text-gray-700 mb-3 text-basic">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}</Text>
              </>
            ) : null}
            <Suspense fallback={<ActivityIndicator />}>
              <ChangedAddress />
            </Suspense>
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

        {timeSlots ? (
           <DeliverySlotSelector
            slots={timeSlots}
            selectedDate={selectedDate}
            selectedSlotId={selectedSlotId}
            onSelect={setSelectedSlotId}
          />
         
        ) : (
         <View className="p-4 items-center">
            <Text className="text-basic text-gray-500">Loading available slots...</Text>
          </View> 
        )}

        <Suspense fallback={<ActivityIndicator />}>
          <DeliveryInstructions
            delivey_instruction={deliveryInstruction}
            setdelivery_instruction={setDeliveryInstruction}
          />
          <CancellationPolicy />
        </Suspense>

        <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text className="text-heading font-bold text-black mb-4">Order Summary</Text>
          <View className="flex gap-2">
            <View className="flex-row justify-between"><Text>Subtotal</Text><Text>₹{orderSummary.subtotal}</Text></View>
            <View className="flex-row justify-between"><Text>Discount</Text><Text className="text-green-600">-₹{orderSummary.discount}</Text></View>
            <View className="flex-row justify-between"><Text>Coupon</Text><Text className="text-green-600">-₹{orderSummary.coupon}</Text></View>
            <View className="flex-row justify-between"><Text>Delivery</Text><Text>{orderSummary.delivery}</Text></View>
            <View className="flex-row justify-between"><Text>Tax</Text><Text>₹{orderSummary.tax}</Text></View>
            <View className="border-t border-gray-200 pt-1 mt-2">
              <View className="flex-row justify-between">
                <Text className="font-bold">Total</Text>
                <View className="items-end">
                  <Text className="font-bold">₹{orderSummary.total}</Text>
                  <Text className="text-green-600 mt-1">You saved ₹{orderSummary.savings}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {!thank && (
        <View className="bg-white px-4 py-3 shadow-lg border-t border-gray-200">
          <TouchableOpacity
            onPress={handleCheckout}
            className="bg-green-600 rounded-lg py-4 px-6 items-center"
          >
            <View className="flex-row w-full justify-between">
              <Text className="text-white font-bold text-lg">
                {CheckoutMutation.isPending ? 'Proceeding...' : 'Proceed to Payment'}
              </Text>
              <Text className="text-white text-xl font-bold mt-1">₹{orderSummary.total}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      <ZipCodeNotServiceableModal
  visible={zipModalVisible}
  onClose={() => setZipModalVisible(false)}
  message={zipMessage}
/>


      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default OrderScreen;
