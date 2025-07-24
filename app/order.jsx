import React, { useEffect, useState,useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
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
import useAuthStore from '../Store/AuthStore';
import { toastConfig } from '../hooks/toastConfig';


const OrderScreen = () => {
  const router = useRouter();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [delivey_instruction,setdelivery_instruction]=useState("");
  const[payment_Method,setpayment_Method]=useState("COD");
  const [showInput, setShowInput] = useState(true);

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

  const {user,token}=useAuthStore();

  const { selectedAddress } = useAddressStore();
const ApplyCouponMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post('https://api.apnifarming.com/user/coupon/apply.php', payload);
      return res.data;

    },
  });

  const CheckoutMutation=useMutation({
    mutationFn:async(payload)=>{
      const res=await axios.post('https://api.apnifarming.com/user/checkout/submit.php',
        payload
      );
      return res.data;
    },
    onSuccess:(data)=>{
      console.log("Data is success",data);
    },
    onError:(error)=>{
      console.log(error.message);
      
    }

  })

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
        const allSlots = res.data.data;

        // Filter available future slots for the selected date
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

        if (availableFutureSlots.length > 0) {
          setSelectedSlotId(availableFutureSlots[0].id);
        } else {
          setSelectedSlotId(null); // reset if no valid slots
        }

        useCartStore.getState().applyChargesFromBackend({
          delivery_charge: parseFloat(res.data.deliverycharge || 0),
          gst: parseFloat(res.data.tax || 0),
        });
      }

    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load slots' });
    } finally {
      setIsLoading(false);
    }
  };

  const validate = async () => {
    try {
      await useCartStore.getState().revalidateCoupon(ApplyCouponMutation);
    } catch (err) {
      if (isMounted.current) {
        Toast.show({
          type: 'error',
          text1: 'Coupon Removed',
          text2: 'Something went wrong while validating the coupon',
        });
      }
    }
  };

  validate();
  fetchTimeSlots();

  return () => {
    isMounted.current = false;
  };
}, [selectedDate]); 

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
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


    
const orderPayload = {
  user_token:token,
  user_id:user.userId,
  phone:user.phone,
  first_name: user.name,
  payment_method:payment_Method,
  total_price: totalAmount,
  final_price:finalAmount,
  tax: gstAmount,
  shipping_price: deliveryCharge,
  coupon_code: couponCode || "Not Selected",
  discount: discount,
  shipping_address: selectedAddress.street,
  shipping_city: selectedAddress.city,
  shipping_postalcode: selectedAddress.zip,
  delivery_date: new Date(selectedDate).toISOString().split("T")[0],
  delivery_from_time: selectedSlot.start_time,
  delivery_to_time: selectedSlot.end_time,
  shipping_state: selectedAddress.state,
  shipping_country: "India",
  
  // driver_id: user.driver_id,
  delivey_instruction: delivey_instruction,
  order_items: cart.map(item => ({
    product_id: Number(item.id),
    product_name: item.name,
    product_qty: item.quantity,
    variant_size: item.selectedSize?.size+" "+item.selectedSize?.option || "",
    variant_id:item.selectedSize?.id,
    mrp: item.costPrice,
    sale_price: item.price
  }))
};

   CheckoutMutation.mutate(orderPayload);
   console.log(orderPayload);
   
    
    

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

      <ScrollView className="flex-1 px-4"   contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }}>
          <Coupon />
        <View className="mb-1 px-6">
          <View className="bg-white rounded-lg pb-4 border-b border-b-gray-100 mb-4">
            <Text className="text-heading-small font-bold text-gray-900 mb-1">Delivery Address</Text>
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


<View className="mb-1 px-6">
  <Text className="text-heading-small font-semibold text-gray-800 mb-2">Delivery Instructions</Text>

  {showInput ? (
    <>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 text-basic placeholder:text-gray-400"
        placeholder="e.g. Leave at the door, call before arrival..."
        value={delivey_instruction}
        onChangeText={setdelivery_instruction}
        multiline
      />

      <TouchableOpacity
        onPress={() => {
          if (delivey_instruction.trim()) {
            setShowInput(false); // hide input
            Toast.show({
              type: 'success',
              text1: 'Instruction Saved',
              text2: 'Delivery instruction submitted',
              visibilityTime:800
            });
          } else {
            Toast.show({
              type: 'info',
              text1: 'Empty Instruction',
              text2: 'Please enter something or cancel',
              visibilityTime:800
            });
          }
        }}
        className="mt-3 bg-green-500 rounded-full py-2 px-4 self-start"
      >
        <Text className="text-white text-heading-small font-medium">Add</Text>
      </TouchableOpacity>
    </>
  ) : (
    <View className="bg-gray-100 flex-row justify-between p-3 rounded-md">
      <View>
   <Text className="text-basic text-gray-700 font-semibold mb-1">Your Note:</Text>
      <Text className="text-basic text-gray-800 mb-2">{delivey_instruction}</Text>

      </View>
   

      <TouchableOpacity
        onPress={() => setShowInput(true)}
        className="bg-blue-600 rounded-lg py-1 px-3 self-start"
      >
        <Text className="text-white text-sm">Edit</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

{/* Pament Method */}
{/* <View className="mb-4 px-6">
  <Text className="text-heading-small font-semibold text-gray-800 mb-2">Payment Method</Text>
  <TouchableOpacity
    onPress={() => setpayment_Method("COD")}
    className={`py-2 px-3 border rounded-lg ${payment_Method === "COD" ? 'border-green-500' : 'border-gray-300'}`}
  >
    <Text>Cash on Delivery</Text>
  </TouchableOpacity>
</View> */}

        {/* Order Summary */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text className="text-heading font-bold text-black mb-4">Order Summary</Text>
          
          <View className="flex gap-1">
            <View className="flex-row justify-between">
              <Text className="text-basic text-gray-600">Subtotal</Text>
              <Text className="text-basic font-medium">₹{totalAmount.toFixed(2)}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-basic text-gray-600">Discount</Text>
              <Text className="text-basic text-green-600">-₹{discount.toFixed(2)}</Text>
            </View>
             <View className="flex-row justify-between">
              <Text className="text-basic text-gray-600">Coupon</Text>
              <Text className="text-basic text-green-500">-₹{couponDiscount.toFixed(2)}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-basic text-gray-600">Delivery</Text>
              <Text className="text-basic">
                {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toFixed(2)}`}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-basic text-gray-600">Tax</Text>
              <Text className="text-basic">₹{gstAmount.toFixed(2)}</Text>
            </View>
           
            
            <View className="border-t  border-gray-200 pt-1 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-heading-small font-bold">Total</Text>
                <View className="flex items-end">
                   <Text className="text-heading-small  font-bold">₹{finalAmount.toFixed(2)}</Text>
                     <Text className="text-basic  text-green-600 mt-1">
                You saved ₹{(discount + couponDiscount).toFixed(2)}
              </Text>
                </View>
               
              </View>
            
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleCheckout}
          disabled={!selectedSlotId || !selectedAddress}
          className={`bg-green-600 rounded-lg flex justify-between py-4 px-6 items-center ${
            (!selectedSlotId || !selectedAddress) ? 'opacity-50' : ''
          }`}
        >
          <View className="flex-row w-full justify-between">
<Text className="text-white font-bold text-lg">{CheckoutMutation.isPending?"Proceeding ....":"Proceed to Payment"}</Text>
          <Text className="text-white text-sm mt-1">
            ₹{finalAmount.toFixed(2)} 
          </Text>
          </View>
          
          {!selectedSlotId && <Text  className="text-xs text-red-500 font-extrabold ">Warning: Please choose Delivery slot !!!!</Text>}
          {!selectedAddress && <Text className="text-xs text-red-500 font-extrabold ">Warning: Please choose Delivery Address !!!!</Text>}
        </TouchableOpacity>
      </View>

      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default OrderScreen;