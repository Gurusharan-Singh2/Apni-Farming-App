import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Coupon = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.8;

  return (
    <>
      {/* Apply Coupon Button */}
      <TouchableOpacity
        className="flex-row items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm mx-4 my-2"
        onPress={() => setModalVisible(true)}
      >
        <View className="flex-row items-center">
          <View className="bg-orange-100 p-2 rounded-full mr-3">
            <MaterialCommunityIcons name="ticket-percent" size={22} color="#f97316" />
          </View>
          <Text className="text-base font-semibold text-gray-700">Apply Coupon</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#9ca3af" />
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Dimmed Background */}
        <View className="flex-1 justify-end ">
          {/* Bottom Sheet */}
          <View
            className="bg-white rounded-t-3xl p-4"
            style={{ height: modalHeight }}
          >
            {/* Close Button */}
            <View className="items-center mb-4">
              <TouchableOpacity
                className="bg-gray-200 p-3 rounded-full"
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Body Content */}
            <View className="flex-1 justify-center items-center">
              <Text className="text-xl font-semibold text-gray-700">Apply Your Coupon</Text>
              {/* Add your coupon input fields or content here */}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Coupon;
