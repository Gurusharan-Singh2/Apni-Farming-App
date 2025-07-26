import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Keyboard,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useCartStore from "../Store/CartStore";
import Toast from "react-native-toast-message";

export default function SearchBar({ query, onChange, onSubmit }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { cart, addToCart, increment, decrement } = useCartStore();
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const { data } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.apnifarming.com/user/products/search.php?q=${debouncedQuery}`
      );
      return res.data.data || [];
    },
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    setShowSuggestions(debouncedQuery.length >= 2);
  }, [debouncedQuery]);

  useEffect(() => {
    if (data) {
      const initialSizes = {};
      data.forEach(item => {
        const defaultVariant = item.sizes?.[0] || {};
        initialSizes[item.id] = {
          size: defaultVariant.size,
          option: defaultVariant.option,
          costPrice: parseFloat(defaultVariant.costPrice || 0),
          sellPrice: parseFloat(defaultVariant.sellPrice || 0),
        };
      });
      setSelectedSizes(initialSizes);
    }
  }, [data]);

  const handleSubmit = (text) => {
    onSubmit(text);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    onChange("");
    setShowSuggestions(false);
  };

  const handleAddToCart = (item) => {
    const selectedSize = selectedSizes[item.id];
    addToCart({
      id: item.id,
      title: item.name,
      image: item.image,
      selectedSize,
    });

    Toast.show({
      type: 'success',
      text1: 'Added to Cart!',
      text2: `${item.name} was added successfully.`,
      visibilityTime: 1000,
    });
  };

  const handleSelectSize = (item, sizeObj) => {
    setSelectedSizes(prev => ({
      ...prev,
      [item.id]: {
        size: sizeObj.size,
        option: sizeObj.option,
        costPrice: parseFloat(sizeObj.costPrice || 0),
        sellPrice: parseFloat(sizeObj.sellPrice || 0),
      }
    }));
    setModalVisible(false);
  };

  const getCartItem = (item) => {
    const selectedSize = selectedSizes[item.id];
    return cart.find(
      cartItem => cartItem.id === item.id && 
      cartItem.selectedSize?.option?.trim().toLowerCase() === selectedSize?.option?.trim().toLowerCase()
    );
  };

  return (
    <View className="mx-2">
      <View className="flex-row items-center bg-white border border-gray-300 rounded-full px-4 py-1 shadow-sm">
        <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-2">
          <Ionicons name="search" size={18} color="#555" />
        </View>
        <TextInput
          className="flex-1 text-base text-gray-800 placeholder:text-gray-500"
          placeholder="Search milk, fruits, vegetables..."
          value={query}
          onChangeText={(text) => onChange(text)}
          onSubmitEditing={() => handleSubmit(query)}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close-circle" size={28} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={data}
          keyExtractor={(item) => item.id}
          className="bg-white mt-2 rounded-xl shadow-md min-h-[90%]"
          renderItem={({ item }) => {
            const selectedSize = selectedSizes[item.id];
            const cartItem = getCartItem(item);
            const quantity = cartItem?.quantity || 0;

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
                        ₹{selectedSize?.sellPrice} / {selectedSize?.option?.toLowerCase()}
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
                        {item.sizes && (
                          <TouchableOpacity
                            className="border border-gray-300 rounded-md px-4 py-1 flex-row items-center mb-2"
                            onPress={() => {
                              setSelectedProduct(item);
                              setModalVisible(true);
                            }}
                          >
                            <Text className="text-gray-700 text-xs mr-1">
                              {selectedSize?.size + " " + selectedSize?.option?.toLowerCase()}
                            </Text>
                            <Ionicons name="chevron-down" size={14} color="#6B7280" />
                          </TouchableOpacity>
                        )}
          
                        <TouchableOpacity
                          className="border border-green-500 px-8 py-[2px] rounded-full"
                          onPress={() => handleAddToCart(item)}
                        >
                          <Text className="text-green-500 text-basic font-semibold">Add</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </>
            );
          }}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-gray-200 mx-3" />
          )}
          ListEmptyComponent={() => (
            <View className="p-4 items-center justify-center">
              <Text className="text-gray-600">Item not available, try another name</Text>
            </View>
          )}
        />
      )}

      {/* Size Selection Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-xl p-4 w-[85%] max-w-[320px]">
            <Text className="text-lg font-bold mb-3 text-gray-800">
              Select Size for {selectedProduct?.name}
            </Text>
            {selectedProduct?.sizes?.map((sizeObj) => {
              const isSelected = 
                selectedSizes[selectedProduct.id]?.option === sizeObj.option;

              return (
                <TouchableOpacity
                  key={sizeObj.id}
                  className={`py-3 px-3 rounded-lg mb-2 ${
                    isSelected ? 'bg-green-100 border border-green-400' : 'bg-gray-50'
                  }`}
                  onPress={() => handleSelectSize(selectedProduct, sizeObj)}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`text-sm ${
                        isSelected ? 'text-green-800 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {sizeObj.size + " " + sizeObj.option?.toLowerCase()}
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
    </View>
  );
}