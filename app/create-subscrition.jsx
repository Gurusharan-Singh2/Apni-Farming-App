import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import useAuthStore from "../Store/AuthStore";
import useSubscriptionStore from "../Store/SubscriptionStore";
import useAddressStore from "../Store/useAddressStore";
import CartIconWithBadge from "../components/Carticon";
import ChangedAddress from "../components/ChangeAddress";
import ProfileIcon from "../components/ProfileIcon";
import SubscriptinSlotSelector from "../components/SubcriptionDeliverySlot";
import Back from "../components/Back";

export default function CreateSubcription() {
const frequencyOptions = useMemo(() => ["daily", "alternate"], []);
const billingCycleOptions = useMemo(() => [7, 10, 15, 30], []);

  const router = useRouter();
  const isAuthenticated=useAuthStore((state)=>state.isAuthenticated)
  const user=useAuthStore((state)=>state.user)
  const selectedAddress=useAddressStore((state)=>state.selectedAddress)

  const {
  cart,
  discount,
  applyChargesFromBackend,
  deliveryCharge,
  gstAmount,
  totalAmount,
  clearCart,
} = useSubscriptionStore();
const [frequency, setFrequency] = useState("daily");
const [billingCycle, setBillingCycle] = useState(7);
const [hasAutoSelectedSlot, setHasAutoSelectedSlot] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [hasAppliedCharges, setHasAppliedCharges] = useState(false);

  const minDate = useMemo(() => selectedDate, [selectedDate]);


  useEffect(() => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  }, []);

 
  
 

  
const formatDate = (date) => {
  return date.toISOString().split("T")[0]; 
};

const createSubscription = useMutation({
  mutationFn: async () => {
    const payload = {
      user_id: user?.userId,
      frequency,
      start_date: formatDate(selectedDate),
      billing_days: billingCycle,
      address_id: selectedAddress?.id,
      time_slot_id: selectedSlotId,
      products: cart.map((item) => ({
        productid: item?.id,
        varient_id: item?.selectedSize?.id,
        quantity: item?.quantity,
        cost: item?.costPrice,
        tax: gstAmount,
        shipping: deliveryCharge,
      })),
    };

    const res = await axios.post(
      "https://api.apnifarming.com/user/subscription/createsubscription.php",
      payload
    );
    return res.data;
  },
  onSuccess: (data) => {
    
     Toast.show({
  type: "success",
  text1: "🎉 Subscription Created!",
  text2: "Your subscription has been set up successfully. Enjoy your benefits!",
  visibilityTime: 1000,
  autoHide: true,
});

    clearCart();
    
    router.replace("/subscription"); 
  },
  onError: (error) => {
    Toast.show({type:"error", text1:"Failed to create subscription."});
    console.error(error.message);
  },
});

// Memoize order summary calculations
const subtotal = useMemo(() => Number(totalAmount), [totalAmount]);
const total = useMemo(() => subtotal * Number(billingCycle) + Number(deliveryCharge) + Number(gstAmount) - Number(discount), [subtotal, billingCycle, deliveryCharge, gstAmount, discount]);
const saved = useMemo(() => Number(discount), [discount]);

// Memoize handlers
const handleDateConfirm = useCallback((date) => {
  setSelectedDate(date);
  setDatePickerVisibility(false);
}, []);

const handleCreateSubscription = useCallback(() => {
  if (!selectedSlotId) {
    alert("Please select Delivery Slot");
    return;
  }
  createSubscription.mutate();
}, [selectedSlotId, createSubscription]);

const handleSlotSelect = useCallback((id) => setSelectedSlotId(id), []);

const { data: slotResponse, isLoading } = useQuery({
  queryKey: ["Time Slots", totalAmount],
  queryFn: async () => {
    const res = await axios.get(
      `https://api.apnifarming.com/user/checkout/slots.php?subtotal=${totalAmount}`
    );
    return res.data;
  },
});
useEffect(() => {
  if (slotResponse && !hasAppliedCharges) {
    applyChargesFromBackend(slotResponse);
    setHasAppliedCharges(true);
  }
}, [slotResponse, hasAppliedCharges]);



const TimeSlots = useMemo(() => slotResponse?.data || [], [slotResponse]);

  
  
useEffect(() => {
  if (TimeSlots?.length > 0 && !selectedSlotId && !hasAutoSelectedSlot) {
    setSelectedSlotId(TimeSlots[0]?.id);
    setHasAutoSelectedSlot(true);
  }
}, [TimeSlots, selectedSlotId, hasAutoSelectedSlot]);

  return (
    <SafeAreaView className="flex-1 bg-white  ">
      
      <View className="mb-1">
        <View className="flex flex-row w-full justify-between px-6 my-3">
        <Back/>
          <View className="flex flex-row items-center gap-2">
            <CartIconWithBadge />
            {isAuthenticated() && <ProfileIcon />}
          </View>
        </View>
      </View>
    <ScrollView>
        <View className="px-6">
        <View className="bg-white rounded-lg pb-4 border-b border-b-gray-100 mb-4">
          <Text className="text-heading-small font-bold text-gray-900 mb-1">
            Delivery Address
          </Text>
          {selectedAddress ? (
            <>
              <Text className="text-gray-700 mb-1 text-basic">
                {selectedAddress.title}
              </Text>
              <Text className="text-gray-700 mb-1 text-basic">
                {selectedAddress.street}
              </Text>
              <Text className="text-gray-700 mb-3 text-basic">
                {selectedAddress.city}, {selectedAddress.state} -{" "}
                {selectedAddress.zip}
              </Text>
              <ChangedAddress />
            </>
          ) : (
            <ChangedAddress />
          )}
        </View>
      </View>
      <View className="mb-1 px-6">
        <Text className="text-heading-small font-semibold text-gray-800 mb-2">
          Starting Date
        </Text>
        <TouchableOpacity
          className="flex-row items-center justify-between border border-gray-300 bg-white px-2 py-2 rounded-xl shadow-lg"
          onPress={() => setDatePickerVisibility(true)}
          activeOpacity={0.8}
        >
          <Text className="text-basic text-gray-500">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Select a date"}
          </Text>
          <Feather name="calendar" size={22} color="#4B5563" />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={minDate}
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>

      {isLoading ? (
        <View className="p-4 items-center">
          <Text className="text-basic text-gray-500">
            Loading available slots...
          </Text>
        </View>
      ) : (
        <SubscriptinSlotSelector
          slots={TimeSlots || []}
          selectedSlotId={selectedSlotId}
          onSelect={handleSlotSelect}
        />
      )}

     
      <View className="mx-4 mb-1">
  <Text className="text-xl font-bold">Frequency :</Text>
  <View className="flex-row justify-between mt-3">
    {frequencyOptions.map((option) => (
      <TouchableOpacity
        key={option}
        onPress={() => setFrequency(option)}
        className={`${frequency === option ? "bg-green-500" : "bg-white"} border border-green-500 w-[45%] px-7 py-2 rounded-full`}
      >
        <Text className={`text-lg font-bold text-center ${frequency === option ? "text-white" : "text-black"}`}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

<View className="mx-4 my-1">
  <Text className="text-xl font-bold">Billing Cycle :</Text>
  <View className="flex-row flex-wrap justify-between mt-3 gap-y-3">
    {billingCycleOptions.map((days) => (
      <TouchableOpacity
        key={days}
        onPress={() => setBillingCycle(days)}
        className={`${billingCycle === days ? "bg-green-500" : "bg-white"} border border-green-500 w-[47%] px-3 py-2 rounded-full`}
      >
        <Text className={`text-base font-bold text-center ${billingCycle === days ? "text-white" : "text-black"}`}>
          {days} Days
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>


      <View className="bg-white  rounded-lg shadow-sm p-4 ">
               <Text className="text-heading font-bold text-black mb-4">Order Summary</Text>
               
               <View className="flex gap-1">
                 <View className="flex-row justify-between">
                   <Text className="text-basic text-gray-600">Subtotal</Text>
                   <Text className="text-basic font-medium">₹{subtotal} X {Number(billingCycle)}={subtotal * Number(billingCycle)}</Text>
                 </View>
                
                 
                 
                 <View className="flex-row justify-between">
                   <Text className="text-basic text-gray-600">Delivery</Text>
                   <Text className="text-basic">
                     {Number(deliveryCharge) === 0 ? 'Free' : `₹${Number(deliveryCharge)}`}
                   </Text>
                 </View>
                 
                 <View className="flex-row justify-between">
                   <Text className="text-basic text-gray-600">Tax</Text>
                   <Text className="text-basic">₹{Number(gstAmount)}</Text>
                 </View>
                
                 
                 <View className="border-t  border-gray-200 pt-1 mt-2">
                   <View className="flex-row justify-between">
                     <Text className="text-heading-small font-bold">Total</Text>
                     <View className="flex items-end">
                      
<Text className="text-heading-small font-bold">
  ₹{total}
</Text>
                          <Text className="text-basic  text-green-600 mt-1">
                     You saved ₹{saved}
                   </Text>
                     </View>
                    
                   </View>
                 
                 </View>
               </View>
             </View>

     <TouchableOpacity
    onPress={handleCreateSubscription}
  disabled={createSubscription.isPending}
  className="mx-10 bg-black rounded-lg px-5 mb-5 py-4  mt-3 opacity-100"
  style={{ opacity: createSubscription.isPending ? 0.5 : 1 }}
>
  {createSubscription.isPending ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text className="text-white text-center font-semibold text-lg">
      Create Subscription
    </Text>
  )}
</TouchableOpacity>
    </ScrollView>

    </SafeAreaView>
  );
}
