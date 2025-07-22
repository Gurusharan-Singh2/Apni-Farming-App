import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useCartStore from "../Store/CartStore";
import Toast from "react-native-toast-message"
export default function SearchBar({ query, onChange, onSubmit }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { cart, addToCart, increment, decrement } = useCartStore();
  const [debouncedQuery, setDebouncedQuery] = useState(query);

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
    enabled: debouncedQuery.length > 0,
  });

  useEffect(() => {
    setShowSuggestions(debouncedQuery.length > 0);
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

  const getSelectedSize = (item) => {
    const variant = item.variants?.[0];
    return variant
      ? {
          size: variant.option,
          costPrice: parseFloat(variant.mrp_price || 0),
          sellPrice: parseFloat(variant.sell_price || 0),
        }
      : null;
  };

  const getCartItem = (id) => cart.find((item) => item.id === id);

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

      {showSuggestions && data?.length > 0 && (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={data}
          keyExtractor={(item) => item.id}
          className="bg-white mt-2 rounded-xl shadow-md min-h-[90%]"
          renderItem={({ item }) => {
            const selectedSize = getSelectedSize(item);
            const cartItem = getCartItem(item.id);
            const quantity = cartItem?.quantity || 0;

            return (
              <View className="flex-row items-center p-3">
                <Image
                  source={{ uri: item.image }}
                  className="w-10 h-10 rounded mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">
                    {item.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    ₹{selectedSize?.sellPrice} / {selectedSize?.size}
                  </Text>
                </View>

                {cartItem ? (
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
                    onPress={() => {
                      addToCart({
                        ...item,
                        selectedSize,
                      });
                      Toast.show({
                        type: "success",
                        text1: "Added to Cart!",
                        text2: `${item.name} was added successfully.`,
                        visibilityTime: 1000,
                        autoHide: true,
                      });
                    }}
                  >
                    <Text className="text-green-500 text-basic">Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-gray-200 mx-3" />
          )}
        />
      )}
    </View>
  );
}
