import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';

import useAuthStore from '../Store/AuthStore';
import useSubscriptionStore from '../Store/SubscriptionStore';

import ProfileIcon from '../components/ProfileIcon';
import CartIconWithBadge from '../components/Carticon';
import SubcriptionItem from '../components/SubscriptionProductItem';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Back from '../components/Back';

const fetchSubscription = async (user_id) => {
  const { data } = await axios.post(
    'https://api.apnifarming.com/user/subscription/getsubscriptiondetail.php',
    { user_id }
  );
  
  
  return data.subscriptions || [];

};

const fetchSubscriptionProducts = async () => {
  const { data } = await axios.post(
    'https://api.apnifarming.com/user/subscription/getSubscriptionproduct.php'
  );
  return data;
};

const skipSubscription = async ({ subscription_id, skip_date, reason }) => {
  const { data } = await axios.post(
    'https://api.apnifarming.com/user/subscription/skipsubscription.php',
    { subscription_id, skip_date, reason }
  );
  return data;
};

const unskipSubscription = async ({ subscription_id, skip_date }) => {
  const { data } = await axios.post(
    'https://api.apnifarming.com/user/subscription/unskip.php',
    { subscription_id, skip_date }
  );
  return data;
};

const cancelSubscription = async ({ subscription_id }) => {
  const { data } = await axios.post(
    'https://api.apnifarming.com/user/subscription/cancelsubscription.php',
    { subscription_id }
  );
  return data;
};

const SubscribedItem = React.memo(({ item }) => (
  <View className="flex-row bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden">
    <View className="flex-1 p-3 justify-between">
      <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
      <Text className="text-sm text-gray-600">
        Qty: {item.quantity} {item.option}
      </Text>
      <Text className="text-sm text-gray-600">Price: ₹{item.sellPrice}</Text>
    </View>
  </View>
));

export default function SubscriptionScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { cart } = useSubscriptionStore();

  const queryClient = useQueryClient();

  const [showCreateMoreModal, setShowCreateMoreModal] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isReasonModalVisible, setReasonModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [skipReason, setSkipReason] = useState('');
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const userId = user?.userId;

  // Subscription products (for create)
  const { data: subscriptionOrder, isLoading: productsLoading, } = useQuery({
    queryKey: ['subscription-products'],
    queryFn: fetchSubscriptionProducts,
  });

  // Multiple subscriptions array now
  const { data: subscriptions, isLoading:subcriptionLoading,isFetching:isSubscriptionFetching } = useQuery({
    queryKey: ['subscription-detail', userId],
    queryFn: () => fetchSubscription(userId),
    enabled: !!userId,
  });

  // Skip mutation
  const skipMutation = useMutation({
    mutationFn: skipSubscription,
    onSuccess: (data, variables) => {
      if (data.status === 'success') {
        queryClient.setQueryData(['subscription-detail', user?.userId], (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((sub) => {
            if (sub.id !== variables.subscription_id) return sub;
            return {
              ...sub,
              skipped_dates: [...(sub.skipped_dates || []), { skip_date: variables.skip_date }],
            };
          });
        });
        Toast.show({ type: 'success', text1: 'Date skipped successfully!', visibilityTime: 1000 });
        setReasonModalVisible(false);
        setModalVisible(false);
        setSkipReason('');
        setSelectedDate('');
      } else {
        Toast.show({ type: 'error', text1: 'Failed to skip date', visibilityTime: 1000 });
      }
    },
  });

  // Unskip mutation
  const unskipMutation = useMutation({
    mutationFn: unskipSubscription,
    onSuccess: (data, variables) => {
      if (data.status === 'success') {
        queryClient.setQueryData(['subscription-detail', user?.userId], (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((sub) => {
            if (sub.id !== variables.subscription_id) return sub;
            return {
              ...sub,
              skipped_dates: sub.skipped_dates?.filter(
                (s) => !dayjs(s.skip_date).isSame(dayjs(variables.skip_date), 'day')
              ) || [],
            };
          });
        });
        Toast.show({ type: 'success', text1: 'Date unskipped successfully!', visibilityTime: 1000 });
        setModalVisible(false);
      } else {
        Toast.show({ type: 'error', text1: 'Failed to unskip date', visibilityTime: 1000 });
      }
    },
  });

  // Cancel mutation
  const cancelMutation = useMutation({
  mutationFn: cancelSubscription,
  onSuccess: (data) => {
    if (data.status === 'success') {
      Toast.show({ type: 'success', text1: 'Subscription cancelled' });
      // Invalidate & refetch the subscription details query
      queryClient.invalidateQueries(['subscription-detail', user?.userId]);
      queryClient.refetchQueries(['subscription-detail', user?.userId]);
      setCancelModalVisible(false);
      setModalVisible(false);
      setSelectedSubscription(null);
    } else {
      Toast.show({ type: 'error', text1: 'Failed to cancel subscription' });
    }
  },
});


  // Upcoming dates for skip/unskip
const upcomingDates = useMemo(() => {
  if (!selectedSubscription?.future_dates) return [];

  return selectedSubscription.future_dates.map(({ date, status }) => ({
    raw: date,
    display: dayjs(date).format('dddd, MMM D, YYYY'),
    status, // keep status if you need to style based on it
  }));
}, [selectedSubscription]);


  // Check if date skipped for a given subscription
  const isDateSkipped = useCallback(
    (subscription, dateStr) =>
      subscription?.skipped_dates?.some((s) =>
        dayjs(s.skip_date).isSame(dayjs(dateStr), 'day')
      ),
    []
  );

  const renderSubscribedItem = useCallback(({ item }) => <SubscribedItem item={item} />, []);

  // Manage modal open
  const openManageModal = (subscription) => {
    setSelectedSubscription(subscription);
    setModalVisible(true);
  };

  // Cancel modal open
  const openCancelModal = () => {
    setModalVisible(false);
    setCancelModalVisible(true);
  };

  // Handle Cancel button in Manage modal
  const handleCancel = () => {
    openCancelModal();
  };

  // Render product item for "Create More Subscription"
  const renderProductItem = useCallback(({ item }) => (
    <SubcriptionItem item={item} />
  ), []);

  if (subcriptionLoading || productsLoading||isSubscriptionFetching) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#00C851" />
      </SafeAreaView>
    );
  }
  

  const notSubscribed = !subscriptions || subscriptions.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-4 pb-2">
        <Back title="Subscription" url="/home" />
        <View className="flex-row items-center gap-3">
          <CartIconWithBadge />
          {isAuthenticated() && <ProfileIcon />}
        </View>
      </View>

      {/* No subscriptions */}
      {notSubscribed ? (
        <FlatList
          data={subscriptionOrder}
          renderItem={({ item }) => <SubcriptionItem item={item} />}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListFooterComponent={() => (
            <TouchableOpacity
              onPress={() => {
                if (!cart || cart.length === 0) {
                  Toast.show({ type: 'error', text1: 'Please select items' });
                } else {
                  router.replace('/create-subscrition');
                }
              }}
              className={`mt-6 mx-6 p-4 rounded-full shadow-md ${
                !cart || cart.length === 0 ? 'bg-gray-300' : 'bg-green-600'
              }`}
            >
              <Text className="text-white text-center text-lg font-medium">
                Create Subscription
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <ScrollView className="px-5 py-4 space-y-8 ">
          {subscriptions.map((subscription) => (
            <View
              key={subscription.id}
              className="bg-gray-50 p-2 rounded-xl shadow-sm border border-gray-200"
            >
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                Subscription #{subscription.id}
              </Text>
              <Text className="text-gray-700">
                Start Date:{' '}
                <Text className="font-medium">{subscription.start_date}</Text>
              </Text>
              <Text className="text-gray-700">
                Next Order Date:{' '}
                <Text className="font-medium">{subscription.next_order_date}</Text>
              </Text>
              <Text className="text-gray-700">
                Frequency:{' '}
                <Text className="font-medium capitalize">{subscription.frequency}</Text>
              </Text>
              <Text className="text-gray-700">
                Billing Days:{' '}
                <Text className="font-medium">{subscription.billing_days}</Text>
              </Text>

              <Text className="text-lg font-semibold text-gray-800 mt-2 mb-2">
                Items in Subscription
              </Text>
              <FlatList
                data={subscription.items}
                renderItem={renderSubscribedItem}
                keyExtractor={(_, i) => i.toString()}
                scrollEnabled={false}
              />

              <TouchableOpacity
                onPress={() => openManageModal(subscription)}
                className="bg-green-600 p-3 rounded-lg mt-3"
              >
                <Text className="text-white text-center font-semibold">Manage</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => setShowCreateMoreModal(true)}
            className="bg-blue-600 p-3 rounded-lg mt-6 mb-10"
          >
            <Text className="text-white text-center font-semibold">
              Create More Subscription
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

     {/* Manage Modal */}
<Modal
  isVisible={isModalVisible}
  onBackdropPress={() => setModalVisible(false)}
  onBackButtonPress={() => setModalVisible(false)}
  animationIn="slideInUp"
  animationOut="slideOutDown"
  style={{ justifyContent: 'flex-end', margin: 0 }}
>
  <View className="bg-white rounded-t-2xl shadow-lg p-5 max-h-[85%]">
    {/* Header */}
    <View className="flex-row justify-between items-center mb-4 border-b border-gray-200 pb-3">
      <Text className="text-xl font-bold text-gray-800">Manage Subscription</Text>
      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Ionicons name="close" size={24} color="#555" />
      </TouchableOpacity>
    </View>

    {/* Dates List */}
    <FlatList
      data={upcomingDates}
      keyExtractor={(item) => item.raw}
      renderItem={({ item }) => {
        const skipped = isDateSkipped(selectedSubscription, item.raw);
        return (
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-800">{item.display}</Text>
            {skipped ? (
              <TouchableOpacity
                onPress={() => {
                  unskipMutation.mutate({
                    subscription_id: selectedSubscription?.id,
                    skip_date: item.raw,
                  });
                }}
                className="bg-red-500 px-4 py-1 rounded-full shadow-sm"
              >
                <Text className="text-white font-semibold">Unskip</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setSelectedDate(item.raw);
                  setReasonModalVisible(true);
                }}
                className="bg-green-600 px-4 py-1 rounded-full shadow-sm"
              >
                <Text className="text-white font-semibold">Skip</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }}
    />

    {/* Buttons */}
    <TouchableOpacity
      onPress={handleCancel}
      className="bg-red-600 p-3 rounded-lg mt-5 shadow-sm"
    >
      <Text className="text-white text-center font-semibold">Cancel Subscription</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => setModalVisible(false)}
      className="mt-3 p-3 rounded-lg border border-gray-300"
    >
      <Text className="text-center font-semibold text-gray-700">Close</Text>
    </TouchableOpacity>
  </View>
</Modal>

{/* Skip Reason Modal */}
<Modal
  isVisible={isReasonModalVisible}
  onBackdropPress={() => setReasonModalVisible(false)}
  onBackButtonPress={() => setReasonModalVisible(false)}
  animationIn="slideInUp"
  animationOut="slideOutDown"
  style={{ justifyContent: 'flex-end', margin: 0 }}
>
  <View className="bg-white rounded-t-2xl shadow-lg p-5">
    <View className="flex-row justify-between items-center mb-4 border-b border-gray-200 pb-3">
      <Text className="text-lg font-bold text-gray-800">Skip Reason</Text>
      <TouchableOpacity onPress={() => setReasonModalVisible(false)}>
        <Ionicons name="close" size={22} color="#555" />
      </TouchableOpacity>
    </View>

    <TextInput
      multiline
      numberOfLines={4}
      value={skipReason}
      onChangeText={setSkipReason}
      placeholder="Enter reason for skipping"
      className="border border-gray-300 rounded-lg p-3 text-base text-gray-800"
      placeholderTextColor="#999"
    />

    <TouchableOpacity
      disabled={!skipReason.trim() || skipMutation.isLoading}
      onPress={() => {
        if (!skipReason.trim()) {
          Toast.show({ type: 'error', text1: 'Please enter a reason' });
          return;
        }
        skipMutation.mutate({
          subscription_id: selectedSubscription?.id,
          skip_date: selectedDate,
          reason: skipReason,
        });
      }}
      className={`mt-5 py-3 rounded-lg shadow-sm ${
        !skipReason.trim() || skipMutation.isLoading ? 'bg-gray-400' : 'bg-green-600'
      }`}
    >
      {skipMutation.isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-center font-semibold">Submit</Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => setReasonModalVisible(false)}
      className="mt-3 p-3 rounded-lg border border-gray-300"
    >
      <Text className="text-center font-semibold text-gray-700">Cancel</Text>
    </TouchableOpacity>
  </View>
</Modal>

{/* Cancel Subscription Modal */}
<Modal
  isVisible={isCancelModalVisible}
  onBackdropPress={() => setCancelModalVisible(false)}
  onBackButtonPress={() => setCancelModalVisible(false)}
  animationIn="slideInUp"
  animationOut="slideOutDown"
  style={{ justifyContent: 'flex-end', margin: 0 }}
>
  <View className="bg-white rounded-t-2xl shadow-lg p-5">
    <View className="flex-row justify-between items-center mb-4 border-b border-gray-200 pb-3">
      <Text className="text-lg font-bold text-gray-800">Cancel Subscription</Text>
      <TouchableOpacity onPress={() => setCancelModalVisible(false)}>
        <Ionicons name="close" size={22} color="#555" />
      </TouchableOpacity>
    </View>

    <Text className="text-gray-700 mb-6">
      Are you sure you want to cancel this subscription? This action cannot be undone.
    </Text>

    <View className="flex-row gap-3">
      <TouchableOpacity
        onPress={() => setCancelModalVisible(false)}
        className="flex-1 border border-gray-300 p-3 rounded-lg"
      >
        <Text className="text-center font-semibold text-gray-700">No</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          cancelMutation.mutate({ subscription_id: selectedSubscription?.id });
        }}
        className="flex-1 bg-red-600 p-3 rounded-lg shadow-sm"
      >
        {cancelMutation.isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">Yes, Cancel</Text>
        )}
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* Create More Subscription Modal */}
<Modal
  isVisible={showCreateMoreModal}
  onBackdropPress={() => setShowCreateMoreModal(false)}
  onBackButtonPress={() => setShowCreateMoreModal(false)}
  animationIn="slideInUp"
  animationOut="slideOutDown"
  style={{ justifyContent: 'flex-end', margin: 0 }}
>
  <View className="bg-white rounded-t-2xl shadow-lg p-5 max-h-[80%]">
    <View className="flex-row justify-between items-center mb-4 border-b border-gray-200 pb-3">
      <Text className="text-xl font-bold text-gray-800">Create More Subscription</Text>
      <TouchableOpacity onPress={() => setShowCreateMoreModal(false)}>
        <Ionicons name="close" size={24} color="#555" />
      </TouchableOpacity>
    </View>

    <FlatList
      data={subscriptionOrder}
      renderItem={renderProductItem}
      keyExtractor={(_, i) => i.toString()}
      contentContainerStyle={{ paddingBottom: 100 }}
    />

    <TouchableOpacity
      onPress={() => {
        if (!cart || cart.length === 0) {
          Toast.show({ type: 'error', text1: 'Please select items' });
          return;
        }
        router.replace('/create-subscrition');
      }}
      className={`mt-4 p-4 rounded-full shadow-md ${
        !cart || cart.length === 0 ? 'bg-gray-300' : 'bg-green-600'
      }`}
    >
      <Text className="text-white text-center text-lg font-medium">
        Create Subscription
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => setShowCreateMoreModal(false)}
      className="mt-3 p-3 rounded-lg border border-gray-300"
    >
      <Text className="text-center font-semibold text-gray-700">Close</Text>
    </TouchableOpacity>
  </View>
</Modal>

    </SafeAreaView>
  );
}
