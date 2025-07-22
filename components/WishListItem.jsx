import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCartStore from '../Store/CartStore';
import useAuthStore from '../Store/AuthStore';
import Toast from 'react-native-toast-message';

const WishListItem = ({ item }) => {
  const { cart, addToCart, increment, decrement } = useCartStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item?.sizes?.[0] || {});

  const cartItem = cart.find(i => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart({
      ...item,
      selectedSize,
      price: selectedSize.sellPrice,
    });
    Toast.show({
      type: 'success',
      text1: 'Added to Cart!',
      text2: `${item.name} was added successfully.`,
      visibilityTime: 1000,
      autoHide: true,
    });
  };

  const handleSelectSize = (sizeObj) => {
    setSelectedSize(sizeObj);
    setModalVisible(false);
  };

  return (
    <>
      <View className="flex-row items-center bg-white rounded-xl shadow-md p-3 mx-2 my-1">
        <Image
          source={{ uri: item.image }}
          className="w-12 h-12 rounded-md mr-3"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-gray-600 text-sm">
            ₹{selectedSize?.sellPrice} / {selectedSize?.size}{selectedSize?.option}
          </Text>
        </View>

        {quantity > 0 ? (
          <View className="flex-row items-center  bg-green-600 rounded-full px-2 py-[3px] gap-3">
            <View>
               <TouchableOpacity onPress={() => decrement(item.id)}>
              <Ionicons name="remove" size={22} color="#fff" />
            </TouchableOpacity>
              </View>
           
            <Text className="text-white text-basic font-semibold">{quantity}</Text>
            <View>
              <TouchableOpacity onPress={() => increment(item.id)}>
              <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            className="border border-green-500 px-8 py-[3px] rounded-full"
            onPress={handleAddToCart}
          >
            <Text className="text-green-500 text-basic font-medium">Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Size Selection Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center items-center"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-xl p-4 w-[80%]">
            <Text className="text-base font-semibold mb-3">Select Size</Text>
            {item.sizes.map((sizeObj) => (
              <TouchableOpacity
                key={sizeObj.size}
                className={`py-3 border-b border-gray-200 ${selectedSize.size === sizeObj.size ? 'bg-green-100' : ''}`}
                onPress={() => handleSelectSize(sizeObj)}
              >
                <View className="flex-row justify-between px-2">
                  <Text className={`text-sm ${selectedSize.size === sizeObj.size ? 'font-bold text-green-600' : 'text-gray-700'}`}>
                    {sizeObj.size}
                  </Text>
                  <Text className={`text-sm ${selectedSize.size === sizeObj.size ? 'font-bold text-green-600' : 'text-gray-500'}`}>
                    ₹{sizeObj.sellPrice}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default WishListItem;
