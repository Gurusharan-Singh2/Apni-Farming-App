import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import useCartStore from '../Store/CartStore';
import useAuthStore from '../Store/AuthStore';

const Pp = ({ product }) => {
  const cart = useCartStore((s) => s.cart);
  const addToCart = useCartStore((s) => s.addToCart);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [selectedSize, setSelectedSize] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (product?.sizes?.length) setSelectedSize(product.sizes[0]);
  }, [product]);

  const quantity = useMemo(
    () =>
      cart.find(
        (i) =>
          Number(i.id) === Number(product?.id) &&
          Number(i.selectedSize?.id) === Number(selectedSize?.id)
      )?.quantity || 0,
    [cart, product?.id, selectedSize?.id]
  );

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) {
      Toast.show({ type: 'error', text1: 'Please select a size first.' });
      return;
    }
    addToCart({
      ...product,
      selectedSize: { ...selectedSize, id: Number(selectedSize.id) },
      price: selectedSize.sellPrice,
    });
    Toast.show({
      type: 'success',
      text1: 'Added to Cart!',
      text2: `${product.name} added successfully.`,
      visibilityTime: 1000,
    });
  }, [selectedSize, addToCart, product]);

  const handleSelectSize = useCallback((size) => {
    setSelectedSize(size);
    setModalVisible(false);
  }, []);

  return (
    <View className="bg-white rounded-xl p-4 relative">
      <Image
        source={{ uri: product.image }}
        className="w-full h-[200px] rounded-lg"
        resizeMode="contain"
      />

      <Text className="text-lg font-bold text-gray-800 mt-2">
        {product.name}
      </Text>

      {selectedSize && (
        <View className="flex-row items-center mt-1">
          {selectedSize.discount && (
            <Text className="text-gray-500 line-through mr-2">
              ₹{selectedSize.costPrice}
            </Text>
          )}
          <Text className="text-green-600 font-bold">
            ₹{selectedSize.sellPrice}
          </Text>
        </View>
      )}

      {selectedSize && (
        <TouchableOpacity
          className="border border-gray-300 rounded-md px-2 py-2 mt-3 flex-row justify-between items-center"
          disabled={quantity > 0}
          onPress={() => setModalVisible(true)}
        >
          <Text
            className={`text-sm ${
              quantity > 0 ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {selectedSize.size + ' ' + selectedSize.option?.toLowerCase()}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={quantity > 0 ? '#e5e7eb' : '#6B7280'}
          />
        </TouchableOpacity>
      )}

      {quantity === 0 ? (
        <TouchableOpacity
          className="bg-green-500 py-3 rounded-full mt-3"
          onPress={handleAddToCart}
        >
          <Text className="text-white text-center font-semibold text-sm">
            Add to Cart
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="flex-row items-center justify-between bg-green-600 rounded-full px-4 py-3 mt-3">
          <TouchableOpacity
            onPress={() => decrement(product?.id, selectedSize.id)}
          >
            <Ionicons name="remove" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white font-semibold">{quantity}</Text>
          <TouchableOpacity
            onPress={() => increment(product?.id, selectedSize.id)}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-xl p-4 w-[85%] max-w-[320px]">
            <Text className="text-lg font-bold mb-3 text-gray-800">
              Select Size
            </Text>
            {product?.sizes?.map((sizeObj) => {
              const isSelected = selectedSize?.id === sizeObj.id;
              return (
                <TouchableOpacity
                  key={sizeObj.id}
                  className={`py-3 px-3 rounded-lg mb-2 ${
                    isSelected
                      ? 'bg-green-100 border border-green-400'
                      : 'bg-gray-50'
                  }`}
                  onPress={() => handleSelectSize(sizeObj)}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`text-sm ${
                        isSelected
                          ? 'text-green-800 font-bold'
                          : 'text-gray-700'
                      }`}
                    >
                      {sizeObj.size + ' ' + sizeObj.option?.toLowerCase()}
                    </Text>
                    <Text
                      className={`text-sm ${
                        isSelected
                          ? 'text-green-800 font-bold'
                          : 'text-gray-600'
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
    </View>
  );
};

export default React.memo(Pp);
