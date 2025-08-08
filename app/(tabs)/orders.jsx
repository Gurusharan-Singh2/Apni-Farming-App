import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import useAuthStore from '../../Store/AuthStore';
import { Colors } from '../../assets/Colors';
import BuyitAgain from '../../components/BuyitAgain';
import EmptyCart from '../../components/EmptyCart';

const statusConfig = {
  'Order Confirmed': { icon: 'checkmark-done-outline', color: Colors.PRIMARY },
  'Order Packed and Ready for Dispatch': { icon: 'cube-outline', color: '#FFA500' },
  'Out for Delivery': { icon: 'bicycle-outline', color: '#1E90FF' },
  'Delivered': { icon: 'home-outline', color: 'green' },
  'Refunded': { icon: 'cash-outline', color: 'purple' },
  'Cancelled': { icon: 'close-circle-outline', color: 'red' },
};

const Orders = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const uid = user.userId;

  const fetchOrders = async () => {
    const response = await axios.post(
      'https://api.apnifarming.com/user/myaccount/orderlistbyuid.php',
      { uid }
    );
    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    refetch,   // <-- get the refetch function from useQuery
  } = useQuery({
    queryKey: ['orders', uid],
    queryFn: fetchOrders,
    enabled: !!uid,
  });

  // Refetch orders every time screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Memoize renderOrder for FlatList
  const renderOrder = React.useCallback(({ item: order }) => {
    const { icon, color } = statusConfig[order.order_status] || {
      icon: 'help-circle-outline',
      color: 'gray',
    };

    return (
      <View
        key={order.id}
        className="flex gap-2 bg-white rounded-xl px-4 py-3 mb-3 mx-4 shadow-sm"
        style={{ elevation: 2 }}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-heading-big font-bold mb-1">Order #{order.id}</Text>

          <View className="flex-row items-center gap-2">
            <Ionicons name={icon} size={20} color={color} />
            <Text className="text-heading-big font-bold mb-1" style={{ color }}>
              {order.order_status}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-gray-700">
          Delivery: {order.delivery_date} ({order.delivery_from_time} - {order.delivery_to_time})
        </Text>

        <Text className="text-heading-big font-bold mb-1 border-b-[1px] border-b-gray-200  pb-4">
          Total: ₹{order.total_price}
        </Text>

        <TouchableOpacity
          onPress={() => router.push(`/order-details/${order.id}`)}
          className="mt-3 w-full  bg-white border-2 border-gray-200 py-2 px-4 rounded-md self-start"
        >
          <Text className="text-gray-700 text-center text-heading-[12px] font-semibold">
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [router]);

  // Memoize keyExtractor
  const keyExtractor = React.useCallback((order) => order.id?.toString(), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
      {/* Header */}
      <View className="mb-1">
        <View className="flex flex-row w-full justify-between px-6 my-3">
          <View className="flex-row items-center py-3 bg-white">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center w-40 gap-3"
            >
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text className="text-heading-big">My Orders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.PRIMARY} className="mt-10" />
      ) : isError ? (
        <Text className="text-red-500 text-center mt-10">Failed to load orders.</Text>
      ) : data?.orders?.length > 0 ? (
        <FlatList
          data={data.orders}
          renderItem={renderOrder}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      ) : (
        <>
          <EmptyCart />
          <BuyitAgain
            url={`https://api.apnifarming.com/user/products/youamyalsolike.php`}
            title={'No Order'}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Orders;
