import React, { useState, useEffect, useMemo } from "react";
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

  const { data,isLoading } = useQuery({
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

  const handleSubmit = (text) => {
    onSubmit(text);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    onChange("");
    setShowSuggestions(false);
  };

  const handleSelectSize = (item, sizeObj) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [item.id]: {
        id: sizeObj?.id, // ✅ Include ID
        size: sizeObj?.size,
        option: sizeObj?.option,
        costPrice: parseFloat(sizeObj?.costPrice || 0),
        sellPrice: parseFloat(sizeObj?.sellPrice || 0),
        discount: sizeObj?.discount,
      },
    }));
    setModalVisible(false);
  };

  const handleAddToCart = (item) => {
    const selectedSize = selectedSizes[item.id] || item.sizes?.[0];

    if (!selectedSize?.id) {
      Toast.show({
        type: "error",
        text1: "Please select a size first",
      });
      return;
    }

    addToCart({
      id: item.id,
      title: item.name,
      image: item.image,
      selectedSize: {
        ...selectedSize,
        id: Number(selectedSize.id),
      },
    });

    Toast.show({
      type: "success",
      text1: "Added to Cart!",
      text2: `${item.name} was added successfully.`,
      visibilityTime: 1000,
    });
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

      {showSuggestions ? (
  isLoading ? (
    <View className="p-4 items-center justify-center">
      <Ionicons name="hourglass-outline" size={30} color="#aaa" />
      <Text className="text-gray-500 mt-2">Searching...</Text>
    </View>
  ) : data?.length > 0 ? (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={data}
      keyExtractor={(item) => item.id.toString()}
      className="bg-white mt-2 rounded-xl shadow-md min-h-[90%]"
      renderItem={({ item }) => {
        const selectedSize = selectedSizes[item.id] || item.sizes?.[0];
        const quantity =
          cart.find(
            (i) =>
              Number(i.id) === Number(item.id) &&
              Number(i.selectedSize?.id) === Number(selectedSize?.id)
          )?.quantity || 0;

        return (
          <View className="flex-row items-center bg-white p-3 rounded-2xl shadow-sm mb-2 mx-2">
            <Image
              source={{ uri: item.image }}
              className="w-24 h-24 rounded-xl mr-3"
              resizeMode="cover"
            />

            <View className="flex-1 flex-row justify-between items-center">
              <View className="flex-1 mr-2">
                <Text
                  className="text-gray-900 font-semibold text-[14px] mb-1"
                  numberOfLines={2}
                >
                  {item?.name}
                </Text>

                <Text className="text-heading-small mb-1 text-green-600 font-bold">
                  {selectedSize?.discount}
                </Text>

                <View className="flex-row self-start rounded-lg px-1 py-1 bg-[#D02127] justify-between items-center mb-2">
                  {selectedSize?.discount && (
                    <Text className="text-[13px] font-semibold py-1 px-1 rounded-l-lg bg-[#D02127] text-white line-through">
                      ₹{selectedSize?.costPrice}
                    </Text>
                  )}
                  <Text className="text-[14px] bg-white mx-1 px-2 py-1 rounded text-green-600 font-bold">
                    ₹{selectedSize?.sellPrice}
                  </Text>
                </View>
              </View>

              {quantity > 0 ? (
                <View className="flex-row items-center">
                  <View className="flex-row items-center justify-between bg-green-600 rounded-full px-2 py-2 min-w-[100px]">
                    <TouchableOpacity onPress={() => decrement(item.id, selectedSize.id)}>
                      <Ionicons name="remove" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white text-[14px] font-semibold px-2">
                      {quantity}
                    </Text>
                    <TouchableOpacity onPress={() => increment(item.id, selectedSize.id)}>
                      <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View className="items-end">
                  {item.sizes && (
                    <TouchableOpacity
                      className="border mb-4 border-gray-300 rounded-md px-4 py-1 flex-row items-center"
                      onPress={() => {
                        setSelectedProduct(item);
                        setModalVisible(true);
                      }}
                    >
                      <Text className="text-gray-700 text-[14px] mr-1">
                        {selectedSize?.size + " " + selectedSize?.option?.toLowerCase()}
                      </Text>
                      <Ionicons name="chevron-down" size={14} color="#6B7280" />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    className="border border-green-500 px-7 py-2 rounded-full"
                    onPress={() => handleAddToCart(item)}
                  >
                    <Text className="text-green-500 text-[14px] font-bold">Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );
      }}
      ItemSeparatorComponent={() => <View className="h-px bg-gray-200 mx-3 my-2" />}
    />
  ) : (
    <View className="p-4 items-center justify-center">
      <Ionicons name="sad-outline" size={40} color="#ccc" />
      <Text className="text-gray-600 mt-2 text-center">
        No products found. Try something else.
      </Text>
    </View>
  )
) : null}




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
                    isSelected ? "bg-green-100 border border-green-400" : "bg-gray-50"
                  }`}
                  onPress={() => handleSelectSize(selectedProduct, sizeObj)}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`text-sm ${
                        isSelected ? "text-green-800 font-bold" : "text-gray-700"
                      }`}
                    >
                      {sizeObj.size + " " + sizeObj.option?.toLowerCase()}
                    </Text>
                    <Text
                      className={`text-sm ${
                        isSelected ? "text-green-800 font-bold" : "text-gray-600"
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
