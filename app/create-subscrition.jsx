import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import useAuthStore from "../Store/AuthStore";
import ProfileIcon from "../components/ProfileIcon";
import CartIconWithBadge from "../components/Carticon";
import axios from "axios";
import useSubscriptionStore from "../Store/SubscriptionStore";
import ChangedAddress from "../components/ChangeAddress";
import useAddressStore from "../Store/useAddressStore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import SubscriptinSlotSelector from "../components/SubcriptionDeliverySlot";
import Toast from "react-native-toast-message";

export default function CreateSubcription() {
  const [frequency, setFrequency] = useState("daily");
  const [billingCycle, setBillingCycle] = useState(7);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { selectedAddress } = useAddressStore();
  const { cart,discount, finalAmount, applyChargesFromBackend , deliveryCharge,
      gstAmount,totalAmount,clearCart } = useSubscriptionStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  

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
      address_id: selectedAddress.id,
      time_slot_id: selectedSlotId,
      products: cart.map((item) => ({
        productid: item.id,
        varient_id: item?.selectedSize?.id,
        quantity: item.quantity,
        cost: item.costPrice,
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
    
     Toast.show({type:"success", text1:"Subscription created successfully!"});
    clearCart();
    router.push("/subscription"); // or wherever you want to go
  },
  onError: (error) => {
    Toast.show({type:"error", text1:"Failed to create subscription."});
    console.error(error.message);
  },
});

  const handleDateConfirm = (date) => {
    console.log("Selected Date:", date);
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const { data: TimeSlots, isLoading } = useQuery({
    queryKey: ["Time Slots"],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.apnifarming.com/user/checkout/slots.php?subtotal=${totalAmount}`
      );
       applyChargesFromBackend(res.data);
      console.log(res.data);
      
      return res.data.data;
    },
  });

  
  
  useEffect(() => {
    if (TimeSlots?.length > 0 && !selectedSlotId) {
      setSelectedSlotId(TimeSlots[0].id);
    }
  }, [TimeSlots]);

  return (
    <SafeAreaView className="flex-1 bg-white  ">
      
      <View className="mb-1">
        <View className="flex flex-row w-full justify-between px-6 my-3">
          <View className="flex-row items-center py-3 bg-white">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center w-40 gap-3"
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          </View>
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
          minimumDate={selectedDate}
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
          onSelect={setSelectedSlotId}
        />
      )}

      <View className="  mx-4 mb-1">
        <Text className="text-xl font-bold">Frequency :</Text>
        <View className="flex-row justify-between mt-3">
          <TouchableOpacity
            onPress={() => setFrequency("daily")}
            className={`${frequency === "daily" ? "bg-green-500" : "bg-white"}  border  border-green-500 w-[45%] px-7 py-2 rounded-full`}
          >
            <Text
              className={` text-lg font-bold text-center ${frequency === "daily" ? "text-white" : "text-black"}`}
            >
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFrequency("alternate")}
            className={`${frequency === "alternate" ? "bg-green-500" : "bg-white"}  border  border-green-500 w-[45%] px-7 py-2 rounded-full`}
          >
            <Text
              className={` text-lg font-bold text-center ${frequency === "alternate" ? "text-white" : "text-black"}`}
            >
              Alternate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mx-4 my-1">
        <Text className="text-xl font-bold">Billing Cycle :</Text>
        <View className="flex-row flex-wrap justify-between mt-3 gap-y-3">
          {[7, 10, 15, 30].map((days) => (
            <TouchableOpacity
              key={days}
              onPress={() => setBillingCycle(days)}
              className={`${
                billingCycle === days ? "bg-green-500" : "bg-white"
              } border border-green-500 w-[47%] px-3 py-2 rounded-full`}
            >
              <Text
                className={`text-base font-bold text-center ${
                  billingCycle === days ? "text-white" : "text-black"
                }`}
              >
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
                   <Text className="text-basic font-medium">₹{Number(totalAmount)} X {Number(billingCycle)}={Number(totalAmount*billingCycle)}</Text>
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
  ₹{Number(totalAmount) * Number(billingCycle) + Number(deliveryCharge) + Number(gstAmount) - Number
  (discount) }
</Text>
                          <Text className="text-basic  text-green-600 mt-1">
                     You saved ₹{(discount)}
                   </Text>
                     </View>
                    
                   </View>
                 
                 </View>
               </View>
             </View>

     <TouchableOpacity
  onPress={() => {
    if(!selectedSlotId){
      alert("Please select Delivery Slot")
      
    }else{
createSubscription.mutate()
    }
    }
  }
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
