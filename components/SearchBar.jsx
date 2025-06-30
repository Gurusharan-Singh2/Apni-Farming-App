import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const sampleSuggestions = ["Pizza", "Pasta", "Sushi", "Biryani", "Burger"];

export default function SearchBar({ query, onChange, onSubmit }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered =
    query.length > 0
      ? sampleSuggestions.filter((item) =>
          item.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  const handleSubmit = (text) => {
    onSubmit(text);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    onChange("");
    setShowSuggestions(false);
  };

  return (
    <View className="mx-2">
      {/* Rounded Search Box */}
      <View className="flex-row items-center bg-white border border-gray-300 rounded-full px-4 py-1 shadow-sm">
        <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-2">
          <Ionicons name="search" size={18} color="#555" />
        </View>
        <TextInput
          className="flex-1 text-base text-gray-800 placeholder:text-gray-500"
          placeholder="Search food, dishes, cuisines..."
          value={query}
          onChangeText={(text) => {
            onChange(text);
            setShowSuggestions(true);
          }}
          onSubmitEditing={() => handleSubmit(query)}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions Dropdown */}
      {showSuggestions && filtered.length > 0 && (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={filtered}
          keyExtractor={(item) => item}
          className="bg-white mt-2 rounded-xl shadow-md max-h-40"
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-3"
              onPress={() => handleSubmit(item)}
            >
              <Text className="text-gray-800 text-base">{item}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-gray-200 mx-3" />
          )}
        />
      )}
    </View>
  );
}
