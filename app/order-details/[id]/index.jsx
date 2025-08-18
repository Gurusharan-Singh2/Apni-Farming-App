import React, { useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Colors } from "../../../assets/Colors";
import useAuthStore from "../../../Store/AuthStore";
import TrackOrder from "../../../components/TrackOrder";

const OrderDetail = () => {
  const { user } = useAuthStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const uid = user?.userId;

  const fetchOrderDetail = async () => {
    const response = await axios.post(
      "https://api.apnifarming.com/user/myaccount/getorderdetail.php",
      { order_id: id, uid }
    );
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order-detail", id, uid],
    queryFn: fetchOrderDetail,
    enabled: Boolean(id && uid),
    staleTime: 1000 * 30, 
  });

  const order = data?.order;
  const items = data?.items;

  const billedAmount = useMemo(() => {
    if (!items?.length) return 0;
    return items.reduce((sum, item) => {
      const price = parseFloat(item.sale_price || "0");
      const qty = parseInt(item.product_qty || "0");
      return sum + price * qty;
    }, 0);
  }, [items]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
      {/* Header */}
      <View
        className="flex-row items-center px-4 py-3 bg-white shadow-md"
        style={{ elevation: 3 }}
      >
        <TouchableOpacity
          onPress={() => router.replace("/orders")}
          className="mr-4 p-2 rounded-full"
          
        >
          <Ionicons name="arrow-back" size={24}  />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Order Details</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Colors.PRIMARY}
          className="mt-10"
        />
      ) : isError ? (
        <Text className="text-red-500 text-center mt-10 font-semibold">
          Failed to load order details.
        </Text>
      ) : (
        <ScrollView className="flex-1 p-4">
          {/* Order Summary */}
          <View
            className="bg-white rounded-xl p-5 mb-6 shadow-md"
            style={{ elevation: 2 }}
          >
            <Text className="text-2xl font-bold mb-4 text-gray-900">
              Order Summary
            </Text>

            <View className="mb-5">
              <Text className="text-base text-gray-700 mb-1">
                <Text className="font-semibold">Order ID:</Text> #{order?.id}
              </Text>
              <Text className="text-base text-gray-700 mb-1">
                <Text className="font-semibold">Status:</Text>{" "}
                {order?.order_status}
              </Text>
              <Text className="text-base text-gray-700">
                <Text className="font-semibold">Address:</Text>{" "}
                {order?.shipping_address}, {order?.shipping_city}
              </Text>
            </View>

            <View className="border-t border-gray-300 pt-4">
              <Text className="text-xl font-semibold mb-3 text-gray-900">
                Items Ordered
              </Text>

              {items?.map((item) => (
                <View
                  key={item.id}
                  className="mb-3 p-3 rounded-lg bg-gray-50 shadow-sm"
                  style={{ elevation: 1 }}
                >
                  <Text className="text-base font-semibold text-gray-800">
                    {item.product_name}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-1">
                    Size: {item.variant_name}
                  </Text>
                  <Text className="text-sm text-gray-700 font-medium">
                    ₹{item.sale_price} × {item.product_qty}
                  </Text>
                </View>
              ))}
            </View>

            <View className="border-t border-gray-300 pt-4 mt-5 space-y-2">
              <Text className="text-xl font-semibold text-gray-900 mb-3">
                Payment Summary
              </Text>

              <SummaryRow
                label="Billed Amount"
                value={`₹${billedAmount.toFixed(2)}`}
              />
              <SummaryRow
                label="Taxes & Other Fees"
                value={`₹${order?.tax}`}
              />
              <SummaryRow
                label="Delivery Charges"
                value={`₹${order?.shipping_price}`}
              />
              <SummaryRow
                label="Discount"
                value={`-₹${order?.discount}`}
                valueClass="text-green-600"
              />

              <View className="flex-row justify-between border-t border-gray-300 pt-3 mt-3">
                <Text className="text-lg font-bold text-gray-900">Total</Text>
                <Text className="text-lg font-bold text-gray-900">
                  ₹{order?.total_price}
                </Text>
              </View>
            </View>
          </View>

          {/* Track Order Section */}
          <View
            className="bg-white rounded-xl p-5 shadow-md"
            style={{ elevation: 2 }}
          >
            <Text className="text-xl font-bold mb-4 text-gray-900">
              Track Order
            </Text>
            <TrackOrder currentStep={order?.current_step} />
          </View>

          {/* Contact Us Section */}
          <View
            className="bg-white rounded-xl p-5 mt-[2px] mb-6 shadow-md"
            style={{ elevation: 2 }}
          >
            <Text className="text-sm text-gray-700 text-center leading-6">
              For questions, contact us at{" "}
              <Text
                className="text-blue-600 underline"
                onPress={() =>
                  Linking.openURL("mailto:apnifarmingt20@gmail.com")
                }
              >
                apnifarmingt20@gmail.com
              </Text>{" "}
              or call{" "}
              <Text
                className="font-semibold text-gray-900"
                onPress={() => Linking.openURL("tel:+916306371889")}
              >
                +91-6306371889
              </Text>
              .
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const SummaryRow = ({ label, value, valueClass }) => (
  <View className="flex-row justify-between">
    <Text className="text-base text-gray-700">{label}</Text>
    <Text
      className={`text-base font-semibold ${valueClass || "text-gray-900"}`}
    >
      {value}
    </Text>
  </View>
);

export default OrderDetail;
