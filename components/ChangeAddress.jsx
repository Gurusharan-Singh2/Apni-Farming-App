import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as Location from "expo-location";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useAddressStore from '../Store/useAddressStore'; 
import Toast from 'react-native-toast-message';

const ChangedAddress = () => {
  const {
    addresses,
    selectedAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
  } = useAddressStore();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addshow, setAddShow] = useState(false);
  const [coordinates, setCoordinates] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      title: "",
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  // Auto-select first address if none is selected
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => {
    setDrawerVisible(false);
    setAddShow(false);
    setEditIndex(null);
    reset();
  };

  const handleEdit = (index) => {
    const selected = addresses[index];
    setValue("title", selected.title || "");
    setValue("name", selected.name || "");
    setValue("street", selected.street || "");
    setValue("city", selected.city || "");
    setValue("state", selected.state || "");
    setValue("zip", selected.zip || "");
    setCoordinates({
      latitude: selected.latitude || "",
      longitude: selected.longitude || "",
    });
    setEditIndex(index);
    setAddShow(true);
  };

 const handleSelectAddress = (addressOrIndex) => {
    if (typeof addressOrIndex === 'number') {
      // If passed an index
      setSelectedAddress(addresses[addressOrIndex]);
    } else {
      // If passed an address object
      setSelectedAddress(addressOrIndex);
    }
  };


  const onSubmit = (data) => {
    const newAddress = { 
      ...data, 
      ...coordinates,
      id: editIndex !== null ? addresses[editIndex].id : Date.now().toString()
    };
    
    if (editIndex !== null) {
      updateAddress(editIndex, newAddress);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Address updated successfully',
      });
    } else {
      addAddress(newAddress);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Address added successfully',
      });
      
      // Auto-select newly added address
      setSelectedAddress(newAddress);
    }
    reset();
    setAddShow(false);
    setEditIndex(null);
  };

  const useCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setCoordinates({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (place) {
        setValue("street", place.street || "");
        setValue("city", place.city || place.district || "");
        setValue("state", place.region || "");
        setValue("zip", place.postalCode || "");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch location");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="items-start  mt-4">
      <TouchableOpacity onPress={openDrawer}>
        <View className="flex-row items-center space-x-1 px-2 py-1 border-green-500 border rounded-full bg-green-500">
          
          <Text className="text-white text-sm">Change Address</Text>
         
        </View>
        
      </TouchableOpacity>

      <Modal visible={drawerVisible} animationType="slide" transparent={true}>
        <View className="flex-1 bg-[#00000040]">
          <View className="flex-row justify-center p-2 mt-6">
            <TouchableOpacity onPress={closeDrawer}>
              <Text className="border rounded-full bg-black p-1">
                <Entypo name="cross" size={28} color="white" />
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="bg-gray-100 rounded-t-2xl p-4 mt-2">
            <Text className="text-lg font-bebas tracking-widest mb-4">
              Select Delivery Location
            </Text>

            {!addshow ? (
              <>
                <TouchableOpacity
                  className="flex-row bg-white px-4 py-4 rounded-lg mb-4 items-center justify-between"
                  onPress={() => {
                    setAddShow(true);
                    setEditIndex(null);
                    reset();
                  }}
                >
                  <Text className="text-green-600 font-medium text-base">
                    + Add new address
                  </Text>
                  <AntDesign name="right" size={16} color="#6b7280" />
                </TouchableOpacity>

                <Text className="font-semibold mb-3 text-lg text-gray-800">
                  Saved Addresses
                </Text>

                {addresses.length === 0 ? (
                  <Text className="text-gray-500 text-base mb-4">
                    No saved addresses yet.
                  </Text>
                ) : (
                  <View className="flex justify-between">
                    {addresses.map((addr, index) => (
    <TouchableOpacity 
      key={addr.id || index}
      onPress={() => handleSelectAddress(addr)} // Pass the address object
      activeOpacity={0.7}
    >
      <View
        className={` rounded-xl shadow-sm border mb-4 p-4 relative ${
          selectedAddress && 
          (selectedAddress.id === addr.id ||  // Compare by ID if available
           JSON.stringify(selectedAddress) === JSON.stringify(addr)) // Fallback comparison
            ? 'bg-green-100 border-green-500'
            : 'bg-white border-gray-200'
        }`}
      >
        {selectedAddress && 
         (selectedAddress.id === addr.id || 
          JSON.stringify(selectedAddress) === JSON.stringify(addr)) && (
          <View className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <AntDesign name="check" size={14} color="white" />
          </View>
        )}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
            {addr.title || `Address ${index + 1}`}
          </Text>
          <View className="flex-row gap-4 space-x-2">
            <TouchableOpacity onPress={(e) => {
              e.stopPropagation();
              handleEdit(index); 
            }}>
              <AntDesign name="edit" size={22} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                deleteAddress(index); 
              }}
            >
              <AntDesign name="delete" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
                          <Text className="text-sm text-gray-600">{addr.name}</Text>
                          <Text className="text-sm text-gray-600">
                            {addr.street}, {addr.city}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {addr.state} - {addr.zip}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            ) : (
              <View className="bg-white h-full px-2 py-1 rounded-lg shadow-sm relative">
                <TouchableOpacity
                  onPress={() => {
                    setAddShow(false);
                    setEditIndex(null);
                    reset();
                  }}
                  className="mb-3"
                >
                  <FontAwesome6 name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                <ScrollView>
                  {["title", "name", "street", "city", "state", "zip"].map((field, i) => (
                    <View key={i} className="mb-1">
                      <Text className="text-gray-400 text-sm capitalize">{field}</Text>
                      <Controller
                        control={control}
                        name={field}
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            placeholder={field}
                            value={value}
                            onChangeText={onChange}
                            className="border-b border-gray-300 p-2 rounded mb-2"
                            keyboardType={field === "zip" ? "numeric" : "default"}
                          />
                        )}
                      />
                    </View>
                  ))}
                  <View className="mt-4">
                    <Text className="px-4 py-2 text-gray-500 text-sm">
                      Use your location or search your place for better delivery.
                    </Text>

                    <TouchableOpacity
                      onPress={useCurrentLocation}
                      className="border border-gray-200 p-3 rounded-full mb-2 mx-4 flex-row items-center justify-around"
                    >
                      {loading ? (
                        <ActivityIndicator color="green" />
                      ) : (
                        <>
                          <MaterialIcons name="my-location" size={24} color="green" />
                          <Text className="text-green-600 font-extrabold">Use Current Location</Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleSubmit(onSubmit)}
                      className="bg-green-600 p-3 rounded-full mx-4 mb-4 flex-row items-center justify-center"
                    >
                      <Text className="text-white font-semibold text-base">
                        {editIndex !== null ? "Update Address" : "Save Address"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ChangedAddress;