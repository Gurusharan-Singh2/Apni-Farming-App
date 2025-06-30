import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCartStore from '../Store/CartStore';

const ProductCard = ({ item }) => {
  const { addToCart, cart, increment, decrement } = useCartStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item?.sizes?.[0] || {});

  // Match item in cart based on id + size
 const cartItem = cart.find(i => i.id === item.id);
const quantity = cartItem ? cartItem.quantity : 0;

 const handleSelectSize = (sizeObj) => {
  setSelectedSize(sizeObj);
  setModalVisible(false);

  // If already in cart, update it
  const cartItem = cart.find(i => i.id === item.id);
  if (cartItem) {
    addToCart({ ...item, selectedSize: sizeObj });
  }
};


  const handleAddToCart = () => {
    const payload = {
      ...item,
      selectedSize,
      price: selectedSize.sellPrice,
    };
    addToCart(payload);
  };

  return (
    <View className="bg-white ml-2 my-2  p-3  rounded-2xl w-[47%] shadow-md shadow-gray-300">
      {/* Product Image */}
      <View className="relative mb-4 pt-12">
        <Image
          source={{ uri: item?.image }}
          className="w-full h-[130px] rounded-xl "
          resizeMode="contain"
        />
        {item?.tagline && (
          <View className="absolute top-0 left-0 bg-green-600 px-2 rounded-md">
            <Text className="text-white text-xs font-bold">{item.tagline}</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text className="font-semibold text-sm text-gray-800 mb-1" numberOfLines={2}>
        {item?.name}
      </Text>

      {/* Price */}
      <View className="flex-row items-center space-x-2 mb-2">
        <Text className="text-sm text-red-500 line-through">
          ₹{selectedSize?.costPrice || '0'}
        </Text>
        <Text className="text-base text-green-600 font-bold">
          ₹{selectedSize?.sellPrice || '0'}
        </Text>
      </View>

      {/* Size Picker */}
      <TouchableOpacity
        className="border border-gray-300 rounded-md px-2 py-1 mb-3 flex-row justify-between items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-gray-700 text-sm">{selectedSize?.size}</Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </TouchableOpacity>

      {/* Cart Controls */}
      {quantity === 0 ? (
        <TouchableOpacity
          className="bg-green-600 py-2 rounded-xl"
          onPress={handleAddToCart}
        >
          <Text className="text-white text-center font-semibold text-sm">Add to Cart</Text>
        </TouchableOpacity>
      ) : (
       <View className="flex-row items-center justify-between   bg-green-600 rounded-lg px-3 py-2 w-[150px] self-center">
  <TouchableOpacity onPress={() => decrement(item.id)}>
    <Ionicons name="remove" size={24} color="#fff" />
  </TouchableOpacity>

  <Text className="text-base font-semibold text-white">{quantity}</Text>

  <TouchableOpacity onPress={() => increment(item.id)}>
    <Ionicons name="add" size={24} color="#fff" />
  </TouchableOpacity>
</View>

      )}

      {/* Size Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center items-center"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-xl p-4 w-[80%]">
            <Text className="text-base font-semibold mb-3">Available Sizes</Text>
            {item?.sizes?.map((sizeObj, index) => (
              <TouchableOpacity
                key={index}
                className={`py-3 border-b border-gray-200 ${
                  selectedSize?.size === sizeObj.size ? 'bg-green-200' : ''
                }`}
                onPress={() => handleSelectSize(sizeObj)}
              >
                <View className="flex-row px-2 justify-between items-center">
                  <Text
                    className={`text-gray-700 text-sm ${
                      selectedSize?.size === sizeObj.size ? 'font-bold text-green-600' : ''
                    }`}
                  >
                    {sizeObj.size}
                  </Text>
                  <View className="flex-row items-center space-x-4">
                   
                    <Text
                      className={`text-sm ${
                        selectedSize?.size === sizeObj.size ? 'font-bold text-green-600' : 'text-gray-500'
                      }`}
                    >
                      ₹{sizeObj.sellPrice}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ProductCard;
