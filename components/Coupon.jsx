import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useCartStore from '../Store/CartStore';
import Toast from 'react-native-toast-message';


const Coupon = () => {
  const [modalVisiblee, setModalVisiblee] = useState(false);
  const [selectedCouponCode, setSelectedCouponCode] = useState(null); // Track which coupon is being applied

  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.8;

  const {
    finalAmount,
    couponCode,
    applyCouponFromBackend,
    removeCoupon,
  } = useCartStore();

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await axios.get('https://api.apnifarming.com/user/coupon/getCouponlist.php');
      return res.data?.data ?? [];
    },
    enabled: modalVisiblee,
  });

  const ApplyCouponMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post('https://api.apnifarming.com/user/coupon/apply.php', payload);
      return res.data;
    },
  });

  const handleApplyCoupon = (code) => {
    setSelectedCouponCode(code); // Show loader immediately

    const payload = {
      code,
      cart_total: finalAmount,
    };

    ApplyCouponMutation.mutate(payload, {
      onSuccess: (data) => {
        setSelectedCouponCode(null); // Remove loader
        if (data.success) {
          applyCouponFromBackend(data);
          setModalVisiblee(false);
          Toast.show({
            type: 'success',
            text1: 'Coupon applied successfully',
            visibilityTime: 800,
          });
        } else {
           Toast.show({
            type: 'error',
            text1: "Warrning",
            text2:data.error

           })
         
        }
      },
      onError: (error) => {
        console.error('Error applying coupon:', error);
        setSelectedCouponCode(null); // Remove loader
      },
    });
  };

  useEffect(() => {
    if (modalVisiblee) refetch();
  }, [modalVisiblee]);

  return (
    <>
      <TouchableOpacity
        className="flex-row items-center justify-between border border-gray-200 px-6 py-3 bg-white rounded-2xl shadow-sm my-2"
        onPress={() => setModalVisiblee(true)}
      >
        <View className="flex-row items-center justify-between">
          <View className="bg-orange-100 pt-2 rounded-full mr-3">
            <MaterialCommunityIcons name="ticket-percent" size={22} color="#f97316" />
          </View>
          <Text className="text-heading-small font-semibold text-gray-700">
            {couponCode ? `Coupon Applied: ${couponCode}` : 'Apply Coupon'}
          </Text>
        </View>

        {couponCode ? (
          <TouchableOpacity
            className="absolute bottom-2 right-3 bg-red-700 py-2 w-20 rounded-xl"
            onPress={() => {
              removeCoupon();
              Toast.show({
                type: 'success',
                text1: 'Coupon removed successfully',
                visibilityTime: 500,
              });
              setModalVisiblee(false);
            }}
          >
            <Text className="text-white text-basic text-center">Remove</Text>
          </TouchableOpacity>
        ) : (
          <MaterialCommunityIcons name="chevron-right" size={22} color="#9ca3af" />
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisiblee}
        onRequestClose={() => setModalVisiblee(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl p-4" style={{ height: modalHeight }}>
            <View className="items-center mb-4">
              <TouchableOpacity
                className="bg-gray-200 p-3 rounded-full"
                onPress={() => setModalVisiblee(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Text className="text-center font-semibold text-gray-700 mb-2">
                Available Coupons
              </Text>

              {isLoading ? (
                <ActivityIndicator size="large" color="#10b981" />
              ) : isError ? (
                <Text className="text-center text-red-500">Failed to load coupons</Text>
              ) : data.length === 0 ? (
                <Text className="text-center text-gray-500">No coupons available</Text>
              ) : (
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => {
                    const isCouponApplied = couponCode === item.code;
                    const isApplyingThisCoupon = selectedCouponCode === item.code;

                    return (
                      <View className="border border-gray-200 p-4 rounded-xl mb-3 bg-gray-50">
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-heading-big font-bold">
                            Get {item.type === 'fixed' ? `₹${item.value}` : `${item.value}%`}
                          </Text>

                          <TouchableOpacity
                            className={`py-2 w-24 rounded-xl ${
                              isCouponApplied ? 'bg-gray-300' : 'bg-green-600'
                            }`}
                            onPress={() => {
                              if (!isCouponApplied) handleApplyCoupon(item.code);
                            }}
                            disabled={isCouponApplied || isApplyingThisCoupon}
                          >
                            {isApplyingThisCoupon ? (
                              <ActivityIndicator color="#fff" size="small" />
                            ) : (
                              <Text className="text-center text-heading-small text-white font-semibold">
                                {isCouponApplied ? 'Applied' : 'Apply'}
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>

                        <Text className="text-basic text-gray-600">
                          Use Code{' '}
                          <Text className="font-semibold text-heading-small text-green-700">
                            {item.code}
                          </Text>
                        </Text>

                        <Text className="text-sm text-gray-600 mb-8">
                          Order from ₹{item.minorder} • Save up to ₹{item.maxdiscout}
                        </Text>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Coupon;
