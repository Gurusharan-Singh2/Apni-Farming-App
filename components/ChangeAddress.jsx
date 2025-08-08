


import {
  AntDesign,
  Entypo,
  FontAwesome6,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as Location from "expo-location";
import {
  React,
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect
} from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import useAuthStore from "../Store/AuthStore";
import useAddressStore from "../Store/useAddressStore";
import { BackendUrl2 } from "../utils/Constants";

// Default values
const defaultValues = {
  landmark: "",
  street: "",
  city: "Lakhimpur Kheiri",
  state: "Uttar Pradesh",
  zip: "262701",
  default_address: 0,
};

// Field configurations
const fieldConfigs = [
  { name: "street", label: "Street", keyboardType: "default" },
  { name: "landmark", label: "Landmark", keyboardType: "default" },
  { name: "city", label: "City", keyboardType: "default" },
  { name: "state", label: "State", keyboardType: "default" },
  { name: "zip", label: "Zip", keyboardType: "numeric" },
];

// Address item (memoized)
const AddressItem = memo(({ item, isSelected, onSelect, onEdit, onDelete }) => (
  <TouchableOpacity onPress={onSelect}>
    <View
      className={`p-4 mb-4 rounded-xl border ${
        isSelected ? "bg-green-100 border-green-500" : "bg-white border-gray-200"
      }`}
    >
      <Text className="font-semibold text-base">{item.title}</Text>
      <Text className="text-gray-600 text-sm">
        {item.street}, {item.city}
      </Text>
      <Text className="text-gray-600 text-sm">
        {item.state} - {item.zip}
      </Text>
      <View className="absolute gap-4 mr-2 right-0 bottom-1 m-1 flex-row">
        <TouchableOpacity onPress={onEdit}>
          <AntDesign name="edit" size={20} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <AntDesign name="delete" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
));

// Main Component
const ChangeAddress = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addShow, setAddShow] = useState(false);
  const [coordinates, setCoordinates] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [selectedTag, setSelectedTag] = useState("Home");

  const selectedAddress = useAddressStore((state) => state.selectedAddress);
  const setSelectedAddress = useAddressStore((state) => state.setSelectedAddress);
  const addresses = useAddressStore((state) => state.addresses);
  const setAddresses = useAddressStore((state) => state.setAddresses);
  const addAddress = useAddressStore((state) => state.addAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  const deleteAddress = useAddressStore((state) => state.deleteAddress);

  const user = useAuthStore((state) => state.user);
  const customer_id = user?.userId;
  const queryClient = useQueryClient();

  const isFirstAddress = useMemo(() => addresses.length === 0, [addresses]);

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      ...defaultValues,
      default_address: isFirstAddress ? 1 : 0,
    },
  });

  const handleSelect = (item) => {

    setSelectedAddress({ ...item });
    setDrawerVisible(false); // Close modal after selection
  };

  // Fetch address list
// Fetch address list
const { data: addressList, isLoading } = useQuery({
  queryKey: ["addresses", customer_id],
  queryFn: async () => {
    const res = await axios.post(`${BackendUrl2}/user/address/address.php`, {
      action: "get_address_list",
      uid: customer_id,
    });

    return Array.isArray(res.data?.data) ? res.data.data : [];
  },
  enabled: !!customer_id, // still prevents run if no id yet
  onSuccess: (list) => {
    if (list.length > 0) {
    
     
      // Set first address if none selected
      if (!selectedAddress?.id) {
        setSelectedAddress(formatted[0]);
      }
    } else {
      setAddresses([]);
    }
  },
});

// Make sure selectedAddress updates when addresses change
useEffect(() => {
  if (!selectedAddress && addresses.length > 0) {
    setSelectedAddress(addresses[0]);
  }
 
}, [addresses, selectedAddress]);

useEffect(() => {
  
  
  if (addressList && addressList.length > 0) {
      const formatted = addressList.map((item) => ({
        id: item.id,
        uid: item.uid,
        street: item.street_address,
        landmark: item.landmark,
        city: item.city,
        state: item.state,
        zip: item.pincode,
        title: item.address_title,
        default_address: item.default_address,
      }));
      
  setAddresses(formatted )}
},[addressList])

 

  // Add address
  const addMutation = useMutation({
  mutationFn: async (data) =>
    await axios.post(`${BackendUrl2}/user/address/address.php`, data),
  onSuccess: (response, variables) => {
    queryClient.invalidateQueries(["addresses", customer_id]);

    const newAddress = {
      id: response.data?.id,
      uid: customer_id,
      street: variables.street,
      landmark: variables.landmark,
      city: variables.city,
      state: variables.state,
      zip: variables.zip,
      title: variables.title,
      default_address: variables.default_address,
    };

    // Update Zustand immediately for UI
    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newAddress);

    Toast.show({ type: "success", text1: "Address added",visibilityTime:1000 });
    closeDrawer();
  },
  onError: (err) =>
    Toast.show({ type: "error", text1: "Add failed", text2: err.message }),
});


  // Update address
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) =>
      axios.post(`${BackendUrl2}/user/address/address.php`, {
        action: "update_address",
        id,
        ...data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["addresses", customer_id]);
      updateAddress(editIndex, variables.data);
      Toast.show({ type: "success", text1: "Address updated",visibilityTime:1000 });
      closeDrawer();
    },
    onError: (err) =>
      Toast.show({ type: "error", text1: "Update failed", text2: err.message,visibilityTime:1000 }),
  });

  // Delete address
  const deleteMutation = useMutation({
    mutationFn: async ({ id, uid }) =>
      axios.post(`${BackendUrl2}/user/address/address.php`, {
        action: "delete_address",
        id,
        uid,
      }),
    onSuccess: (_, { index }) => {
      queryClient.invalidateQueries(["addresses", customer_id]);
      deleteAddress(index);
      setSelectedAddress(null);
      Toast.show({ type: "success", text1: "Address deleted",visibilityTime:1000 });
    },
    onError: (err) =>
      Toast.show({ type: "error", text1: "Delete failed", text2: err.message }),
  });

  // Close modal
  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
    setAddShow(false);
    setEditIndex(null);
    reset();
    setSelectedTag("Home");
  }, []);

  // Use location
  const useCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync(loc.coords);

      setCoordinates({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      setValue("street", place.street || "");
      setValue("city", place.city || place.district || "");
      setValue("state", place.region || "");
      setValue("zip", place.postalCode || "");
    } catch {
      Alert.alert("Error", "Failed to fetch location");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const addr = addresses[index];
    setEditIndex(index);
    setAddShow(true);
    setSelectedTag(addr.title);
    reset({
      street: addr.street,
      landmark: addr.landmark,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      default_address: addr.default_address,
    });
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      title: selectedTag,
      uid: customer_id,
      ...coordinates,
    };

    if (editIndex !== null) {
      const addr = addresses[editIndex];
      updateMutation.mutate({ id: addr.id, data: payload });
    } else {
      addMutation.mutate({ action: "add_address", ...payload });
    }
  };

  



  return (
    <View className="items-start">
        <TouchableOpacity
        onPress={() => setDrawerVisible(true)}
        className="flex-row items-center space-x-1 px-6 py-1 border border-green-500 rounded-full"
      >
        <Text className="text-green-500 text-sm">
          {selectedAddress ? "Change Address" : "Add Address"}
        </Text>
      </TouchableOpacity>
    

      <Modal visible={drawerVisible} animationType="slide" transparent>
        <View className="flex-1 bg-[#00000040]">
          <View className="flex-row justify-center p-2 mt-6">
            <TouchableOpacity onPress={closeDrawer}>
              <Text className="border rounded-full bg-black p-1">
                <Entypo name="cross" size={28} color="white" />
              </Text>
            </TouchableOpacity>
          </View>

          {!addShow ? (
            <FlatList
              className="bg-gray-100 rounded-t-2xl px-4 pt-4"
              data={addresses}
              keyExtractor={(item) => item.id?.toString()}
              ListHeaderComponent={
                <>
                  <Text className="font-bold text-xl mb-4">Select Delivery Location</Text>

                  <TouchableOpacity
                    onPress={() => {
                      setAddShow(true);
                      setEditIndex(null);
                      reset();
                      setSelectedTag("Home");
                    }}
                    className="bg-white p-4 rounded-lg mb-4 flex-row justify-between"
                  >
                    <Text className="text-green-600 font-medium text-lg">
                      + Add new address
                    </Text>
                    <AntDesign name="right" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </>
              }
              renderItem={({ item, index }) => (
                <AddressItem
                  item={item}
                  key={item.id}
                  isSelected={String(selectedAddress?.id) === String(item.id)}
                  onSelect={() => handleSelect(item)}
                  onEdit={() => handleEdit(index)}
                  onDelete={() =>
                    deleteMutation.mutate({
                      id: item.id,
                      uid: customer_id,
                      index,
                    })
                  }
                />
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <ScrollView className="bg-white p-4 rounded-t-2xl">
              <TouchableOpacity onPress={() => setAddShow(false)} className="mb-3">
                <FontAwesome6 name="arrow-left" size={24} color="black" />
              </TouchableOpacity>

              {fieldConfigs.map((field) => (
                <View key={field.name} className="mb-2">
                  <Text className="text-gray-500">{field.label}</Text>
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder={`Enter ${field.label}`}
                        value={value}
                        onChangeText={onChange}
                        keyboardType={field.keyboardType}
                        className="border-b p-2 border-gray-300"
                      />
                    )}
                  />
                </View>
              ))}

              <View className="flex-row justify-between my-4">
                {["Home", "Work", "Other"].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => setSelectedTag(tag)}
                    className={`flex-1 mx-1 p-2 rounded-full border ${
                      selectedTag === tag ? "bg-green-600" : "bg-white"
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        selectedTag === tag ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Controller
                control={control}
                name="default_address"
                render={({ field: { value, onChange } }) => (
                  <TouchableOpacity
                    onPress={() => onChange(value === 1 ? 0 : 1)}
                    className="flex-row items-center mb-4"
                  >
                    <View
                      className={`w-5 h-5 mr-2 border rounded ${
                        value === 1 ? "bg-green-600" : "bg-white"
                      }`}
                    />
                    <Text className="text-gray-700">Set as default address</Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                onPress={useCurrentLocation}
                className="border border-gray-200 p-3 rounded-full mb-2 flex-row justify-center"
              >
                {loading ? (
                  <ActivityIndicator color="green" />
                ) : (
                  <>
                    <MaterialIcons name="my-location" size={20} color="green" />
                    <Text className="ml-2 text-green-600 font-bold">
                      Use Current Location
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                className="bg-green-600 p-3 rounded-full"
              >
                <Text className="text-white text-center font-semibold">
                  {editIndex !== null ? "Update Address" : "Save Address"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default memo(ChangeAddress);
