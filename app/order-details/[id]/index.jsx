import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Colors } from '../../../assets/Colors';
import useAuthStore from '../../../Store/AuthStore';

const OrderDetail = () => {
    const {user}=useAuthStore();

  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const uid = user.userId;


  const fetchOrderDetail = async () => {
    const response = await axios.post(
      'https://api.apnifarming.com/user/myaccount/getorderdetail.php',
      { order_id: id, uid }
    );
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order-detail', id, uid],
    queryFn: fetchOrderDetail,
    enabled: !!id && !!uid,
  });


 
  
const order = data?.order;
const items = data?.items;

const billedAmount = useMemo(() => {
  if (!items?.length) return 0;

  return items.reduce((sum, item) => {
    const price = parseFloat(item.sale_price || '0');
    const qty = parseInt(item.product_qty || '0');
    return sum + price * qty;
  }, 0);
}, [items]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-heading-big font-bold">Order Details</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} className="mt-10" />
      ) : isError ? (
        <Text className="text-red-500 text-center mt-10">Failed to load order details.</Text>
      ) : (
        <ScrollView className="flex-1 p-4">
          {/* Order Summary */}
          <View className="bg-white p-4 rounded-xl mb-4 shadow-sm" style={{ elevation: 1 }}>
           <View className="border-b border-b-gray-200 pb-5 mb-6">
             <Text className="text-heading-big font-bold mb-2">Order Details</Text>
            
            
            <Text className="text-basic mb-1">Delivery: {order.delivery_date} ({order.delivery_from_time} - {order.delivery_to_time})</Text>
           
            <Text className="text-basic mb-1">Order Id : #{order.id}</Text>
            <Text className="text-basic mb-1">Status : {order.order_status}</Text>
            <Text className="text-basic mb-1">Address: {order.shipping_address}, {order.shipping_city}</Text>

           </View>
            
          {/* Products */}
         <View className="flex-row justify-between">
           <Text className="text-heading-big font-bold mb-2 px-1">Ordered Items</Text>
           <Text className="text-heading-big font-bold mb-2 px-1"> ₹{billedAmount.toFixed(2)}</Text>
         </View>
          {items?.map((item) => (
            <View
              key={item.id}
              className="bg-white p-3 rounded-lg  "
              
            >
              <Text className="text-basic font-semibold">{item.product_name}</Text>
              <Text className="text-basic">Size: {item.variant_name}</Text>
              <Text className="text-basic">₹{item.sale_price} x {item.product_qty}</Text>
            </View>
          ))}
           
            <View className=" flex gap-1 border-t border-gray-200 mt-3 pt-3">
              <Text className="text-heading-big font-bold mb-2 px-1">Order Summary</Text>
             <View className="flex-row justify-between">
               <Text className="text-heading-small">Billed Amount </Text>
            <Text className="text-heading-small font-bold">₹{billedAmount.toFixed(2)}</Text>

               
             </View>
             <View className="flex-row justify-between">
               <Text className="text-heading-small">Taxes & Other Fees </Text>
               <Text className="text-heading-small font-bold">₹{order.tax}</Text>

             </View>
             <View className="flex-row justify-between">
               <Text className="text-heading-small">Delivery Charges </Text>
               <Text className="text-heading-small font-bold">₹{order.shipping_price}</Text>

             </View>
             <View className="flex-row justify-between">
               <Text className="text-heading-small">Discount </Text>
               <Text className="text-heading-small font-bold">₹{order.discount}</Text>

             </View>
             <View className="flex-row justify-between">
               <Text className="text-heading-small">Total </Text>
               <Text className="text-heading-small font-bold">₹{order.total_price}</Text>

             </View>
             
            </View>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OrderDetail;
