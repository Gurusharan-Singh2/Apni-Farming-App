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
import Toast from 'react-native-toast-message';

const WishListItem = ({ item }) => {
  const { cart, addToCart, increment, decrement } = useCartStore();
  const [modalVisible, setModalVisible] = useState(false);

  const defaultVariant = item?.sizes?.[0] || {};
  const [selectedSize, setSelectedSize] = useState({
    size: defaultVariant.size,
    option: defaultVariant.option,
    costPrice: parseFloat(defaultVariant.costPrice || 0),
    sellPrice: parseFloat(defaultVariant.sellPrice || 0),
  });

  const cartItem = cart.find(
    i => i.id === item.id &&
    i.selectedSize?.option?.trim().toLowerCase() === selectedSize.option?.trim().toLowerCase()
  );
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      title: item.title,
      image: item.image,
      selectedSize,
    });

    Toast.show({
      type: 'success',
      text1: 'Added to Cart!',
      text2: `${item.title} was added successfully.`,
      visibilityTime: 1000,
    });
  };

  const handleSelectSize = (sizeObj) => {
    
    
    setSelectedSize({
      size: sizeObj.size,
      option: sizeObj.option,
      costPrice: parseFloat(sizeObj.costPrice || 0),
      sellPrice: parseFloat(sizeObj.sellPrice || 0),
    });
    setModalVisible(false);
  };

  return (
    <>
      <View className="flex-row items-center bg-white p-3 rounded-2xl shadow-sm mb-2 mx-2">
        <Image
          source={{ uri: item.image }}
          className="w-24 h-24 rounded-xl mr-3"
          resizeMode="cover"
        />

        <View className="flex-1 flex-row justify-between items-center">
          <View className="flex-1 mr-2">
            <Text className="text-gray-900 font-semibold text-sm mb-1" numberOfLines={2}>
              {item.name}
            </Text>

            <Text className="text-gray-600 text-sm mb-2">
              ₹{selectedSize.sellPrice} / {selectedSize.option?.toLowerCase()}
            </Text>
          </View>

          {cartItem ? (
            <View className="flex-row items-center">
              <View className="flex-row items-center justify-between bg-green-600 rounded-full px-2 py-1 min-w-[100px]">
                <TouchableOpacity onPress={() => decrement(item.id, selectedSize)}>
                  <Ionicons name="remove" size={18} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white font-semibold px-2">{quantity}</Text>
                <TouchableOpacity onPress={() => increment(item.id, selectedSize)}>
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="items-end">
              <TouchableOpacity
                className="border border-gray-300 rounded-md px-2 py-1 flex-row items-center mb-2"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-gray-700 text-xs mr-1">
                  {selectedSize.size+" "+selectedSize.option?.toLowerCase()}
                </Text>
                <Ionicons name="chevron-down" size={14} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity
                className="border border-green-500 px-6 py-[2px] rounded-full"
                onPress={handleAddToCart}
              >
                <Text className="text-green-500 text-basic font-semibold">Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Size Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-xl p-4 w-[85%] max-w-[320px]">
            <Text className="text-lg font-bold mb-3 text-gray-800">Select Size</Text>
            {item.sizes?.map((sizeObj) => {
              const isSelected =
                selectedSize.size === sizeObj.size;

              return (
                <TouchableOpacity
                  key={sizeObj.id}
                  className={`py-3 px-3 rounded-lg mb-2 ${
                    isSelected ? 'bg-green-100 border border-green-400' : 'bg-gray-50'
                  }`}
                  onPress={() => handleSelectSize(sizeObj)}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`text-sm ${
                        isSelected ? 'text-green-800 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {sizeObj.size+" "+sizeObj.option?.toLowerCase()}
                    </Text>
                    <Text
                      className={`text-sm ${
                        isSelected ? 'text-green-800 font-bold' : 'text-gray-600'
                      }`}
                    >
                      ₹{sizeObj.sellPrice}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default WishListItem;