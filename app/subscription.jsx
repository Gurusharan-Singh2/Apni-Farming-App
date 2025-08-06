import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../Store/AuthStore';
import ProfileIcon from '../components/ProfileIcon';
import CartIconWithBadge from '../components/Carticon';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';
import Modal from 'react-native-modal'; 
import SubcriptionItem from '../components/SubscriptionProductItem';
import useSubscriptionStore from '../Store/SubscriptionStore';

const fetchSubscription = async (user_id) => {
  const res = await axios.post(
    'https://api.apnifarming.com/user/subscription/getsubscriptiondetail.php',
    { user_id }
  );
  return res.data;
};

const fetchSubscriptionProducts = async () => {
  const res = await axios.post(
    'https://api.apnifarming.com/user/subscription/getSubscriptionproduct.php'
  );
  return res.data;
};

const skipSubscription = async ({ subscription_id, skip_date, reason }) => {
  const res = await axios.post(
    'https://api.apnifarming.com/user/subscription/skipsubscription.php',
    {
      subscription_id,
      skip_date,
      reason,
    }
  );
  return res.data;
};

const cancelSubscription = async ({ subscription_id }) => {
  const res = await axios.post(
    'https://api.apnifarming.com/user/subscription/cancelsubscription.php',
    { subscription_id }
  );
  return res.data;
};


const unskipSubscription = async ({ subscription_id, skip_date }) => {
  const res = await axios.post(
    'https://api.apnifarming.com/user/subscription/unskip.php',
    {
      subscription_id,
      skip_date,
    }
  );
  return res.data;
};



export default function SubscriptionScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { cart } = useSubscriptionStore();
  const queryClient = useQueryClient();

 const [isModalVisible, setModalVisible] = useState(false);
const [isReasonModalVisible, setReasonModalVisible] = useState(false);
const [selectedDate, setSelectedDate] = useState('');
const [skipReason, setSkipReason] = useState('');

  const { data: subcriptionOrder } = useQuery({
    queryKey: ['subscription-products'],
    queryFn: fetchSubscriptionProducts,
  });

  const { data: subcriptionDetail, isLoading } = useQuery({
    queryKey: ['subscription-detail', user.userId],
    queryFn: () => fetchSubscription(user.userId),
  });

  const skipMutation = useMutation({
    mutationFn: skipSubscription,
    onSuccess: (data) => {
      if (data.status === 'success') {
        Toast.show({ type: 'success', text1: 'Date skipped successfully!' });
        queryClient.invalidateQueries(['subscription-detail', user.userId]);
      } else {
        Toast.show({ type: 'error', text1: 'Failed to skip date' });
      }
    },
  });


  const unskipMutation = useMutation({
  mutationFn: unskipSubscription,
  onSuccess: (data) => {
    if (data.status === 'success') {
      Toast.show({ type: 'success', text1: 'Date unskipped successfully!' });
      queryClient.invalidateQueries(['subscription-detail', user.userId]);
    } else {
      Toast.show({ type: 'error', text1: 'Failed to unskip date' });
    }
  },
});


const isDateSkipped = (dateStr) => {
  const skips = subcriptionDetail?.subscription?.skipped_dates || [];
  return skips.some(s => dayjs(s.skip_date).isSame(dayjs(dateStr), 'day'));
};



  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: (data) => {
      if (data.status === 'success') {
        Toast.show({ type: 'success', text1: 'Subscription cancelled' });
        queryClient.invalidateQueries(['subscription-detail', user.userId]);
      } else {
        Toast.show({ type: 'error', text1: 'Failed to cancel subscription' });
      }
    },
  });

  const handleCancel = () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel?",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: () =>
            cancelMutation.mutate({
              subscription_id: subcriptionDetail?.subscription?.id,
            }),
        },
      ]
    );
  };

  const renderItem = ({ item }) =>  <SubcriptionItem item={item} />;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#00C851" />
      </SafeAreaView>
    );
  }

  
  

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-xl font-semibold">Subscription</Text>
        </TouchableOpacity>
        <View className="flex-row items-center gap-3">
          <CartIconWithBadge />
          {isAuthenticated() && <ProfileIcon />}
        </View>
      </View>

      {/* Not Subscribed */}
      {subcriptionDetail?.status === "not_subscribed" ? (
        <FlatList
          data={subcriptionOrder}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListFooterComponent={() => (
            <TouchableOpacity
              onPress={() => {
                if (cart.length === 0) {
                  Toast.show({ type: "error", text1: "Please select items" });
                } else {
                  router.push('/create-subscrition');
                }
              }}
              className={`mt-6 mx-6 p-4 rounded-full shadow-md ${
                cart.length === 0 ? 'bg-gray-300' : 'bg-green-600'
              }`}
            >
              <Text className="text-white text-center text-lg font-medium">
                Create Subscription
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <ScrollView className="px-5 py-4 space-y-6">
          {/* Subscription Card */}
          <Text className="text-lg font-semibold text-gray-800 mb-2">Your Subscription</Text>
          <View className="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-200">
            <Text className="text-gray-700">Start Date: <Text className="font-medium">{subcriptionDetail.subscription.start_date}</Text></Text>
            <Text className="text-gray-700">Next Order Date: <Text className="font-medium">{subcriptionDetail.subscription.next_order_date}</Text></Text>
            <Text className="text-gray-700">Frequency: <Text className="font-medium capitalize">{subcriptionDetail.subscription.frequency}</Text></Text>
            <Text className="text-gray-700">Billing Days: <Text className="font-medium">{subcriptionDetail.subscription.billing_days}</Text></Text>
            {/* Subscribed Items */}
{/* Subscribed Products */}
<Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Items in Subscription</Text>

{subcriptionDetail.subscription.items?.map((item, index) => (
  <View
    key={index}
    className="flex-row bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden"
  >

    <View className="flex-1 p-3 justify-between">
      <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
      <Text className="text-sm text-gray-600">Qty: {item.quantity} {item.option}</Text>
      <Text className="text-sm text-gray-600">Price: ₹{item.sellPrice}</Text>
    </View>
  </View>
))}


          </View>


          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-green-600 p-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Manage</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Manage Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0.4}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View className="bg-white w-[90%] p-5 rounded-lg">
         <View className="flex-row justify-between">
           <Text className="text-lg font-bold mb-3 text-gray-800">Manage Subscription</Text>
           <TouchableOpacity className="border rounded-full h-7 w-7 flex justify-center items-center" onPress={()=>setModalVisible(false)}>
            <Text className="text-lg font-bold">X</Text>
           </TouchableOpacity>
         
         </View>
{Array.from({ length: 10 }).map((_, i) => {
 const date = dayjs().add(i, 'day').format('YYYY-MM-DD');
              const showdate = dayjs().add(i, 'day').format('dddd, MMM-D-YYYY');
  
  const skipped = isDateSkipped(date);

  return (
    <View
      key={date}
      className="flex-row justify-between items-center py-2 border-b border-gray-200"
    >
      <Text className="text-gray-700">{showdate}</Text>

      {skipped ? (
        <TouchableOpacity
          onPress={() => {
            unskipMutation.mutate({
              subscription_id: subcriptionDetail?.subscription?.id,
              skip_date: date,
            });
          }}
          className="bg-blue-500 px-3 py-1 rounded-full"
        >
          <Text className="text-white font-semibold text-sm">Unskip</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setSelectedDate(date);
            setReasonModalVisible(true);
          }}
          className="bg-yellow-500 px-3 py-1 rounded-full"
        >
          <Text className="text-white font-semibold text-sm">Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
})}


          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              handleCancel();
            }}
            className="mt-5 bg-red-600 p-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Cancel Subscription</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
  isVisible={isReasonModalVisible}
  onBackdropPress={() => setReasonModalVisible(false)}
  backdropOpacity={0.4}
  style={{ justifyContent: 'center', alignItems: 'center' }}
>
  <View className="bg-white w-[90%] p-5 rounded-lg">
   
    <View className="flex-row justify-between">
           <Text className="text-lg font-semibold mb-3 text-gray-800">
      Why are you skipping {selectedDate}?
    </Text>
           <TouchableOpacity className="border rounded-full h-7 w-7 flex justify-center items-center" onPress={()=>setReasonModalVisible(false)}>
            <Text className="text-lg font-bold">X</Text>
           </TouchableOpacity>
         
         </View>
    
    <TextInput
      value={skipReason}
      onChangeText={setSkipReason}
      placeholder="Enter your reason"
      className="border border-gray-300 rounded-md p-3 mb-4 text-base"
      multiline
    />

    <TouchableOpacity
      onPress={() => {
        if (!skipReason.trim()) {
          Toast.show({ type: 'error', text1: 'Please enter a reason' });
          return;
        }

        skipMutation.mutate({
          subscription_id: subcriptionDetail?.subscription?.id,
          skip_date: selectedDate,
          reason: skipReason,
        });

        setSkipReason('');
        setSelectedDate('');
        setReasonModalVisible(false);
        
      }}
      className="bg-green-600 py-3 rounded-md"
    >
      <Text className="text-white text-center font-semibold">Submit</Text>
    </TouchableOpacity>
  </View>
</Modal>

    </SafeAreaView>
  );
}


