


// import React, { useState, useEffect, useMemo } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   TextInput,
//   ScrollView,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import * as Location from "expo-location";
// import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import Entypo from "@expo/vector-icons/Entypo";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import Toast from "react-native-toast-message";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import useAuthStore from "../Store/AuthStore";
// import useAddressStore from "../Store/useAddressStore";
// import axios from "axios";
// import { BackendUrl2 } from "../utils/Constants";

// const ChangedAddress = () => {
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [addshow, setAddShow] = useState(false);
//   const [coordinates, setCoordinates] = useState({});
//   const [editIndex, setEditIndex] = useState(null);
//   const [selectedTag, setSelectedTag] = useState("Home");

//   const {
//     addresses,
//     selectedAddress,
//     setAddresses,
//     addAddress,
//     updateAddress,
//     deleteAddress,
//     setSelectedAddress,
//   } = useAddressStore();

//   const { user } = useAuthStore();
//   const customer_id = user?.userId;
//   const queryClient = useQueryClient();

//   const isFirstAddress = useMemo(() => addresses.length === 0, [addresses]);


//   const getpayload = {
//     "action": "get_address_list",
//     "uid": customer_id,
//   };

//   const Getdata = useMutation({
//     mutationKey: ["addresses", customer_id],
//    mutationFn: async (data) => {
//   const res = await axios.post(`${BackendUrl2}/user/address/address.php`, data);
//   return res.data;
// }
// ,
//    onSuccess: (data) => {
//   const formatted = (data?.data || []).map((item) => ({
//     id: item.id,
//     uid: item.uid,
//     street: item.street_address,
//     landmark: item.landmark,
//     city: item.city,
//     state: item.state,
//     zip: item.pincode,
//     title: item.address_title,
//     default_address: item.default_address,
//   }));

//   setAddresses(formatted);
  
  
// }
// ,
//     onError: (error) => {
//       console.log(error);
      
//     },
//     enabled: !!customer_id,
//   });

//   const addMutation = useMutation({
//    mutationFn: async (data) =>
//   await axios.post(`${BackendUrl2}/user/address/address.php`, data),

//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries(["addresses", customer_id]);
//       Toast.show({ type: "success", text1: "Address added successfully",  visibilityTime: 500,
//       autoHide: true, });
//       addAddress({ id: Date.now(), ...variables }); // use unique ID from backend in real case
//       closeDrawer();
//     },
//     onError: (error) => {
//       Toast.show({ type: "error", text1: "Add failed", text2: error.message });
//     },
//   });

//  const updateMutation = useMutation({
//   mutationFn: async ({ id, data }) =>
//     await axios.post(`${BackendUrl2}/user/address/address.php`, {
//       action: "update_address",
//       id,
//       ...data,
//     }),
//   onSuccess: (_, variables) => {
//     queryClient.invalidateQueries(["addresses", customer_id]);
//     Toast.show({ type: "success", text1: "Address updated successfully",  visibilityTime: 500,
//       autoHide: true, });
//     updateAddress(editIndex, variables.data);
//     closeDrawer();
//   },
//   onError: (error) => {
//     console.log(error);
    
//     Toast.show({ type: "error", text1: "Update failed", text2: error.message });
//   },
// });

// const deleteMutation = useMutation({
//   mutationFn: async ({ id, uid }) =>
//     await axios.post(`${BackendUrl2}/user/address/address.php`, {
//       action: "delete_address",
//       id,
//       uid,
//     }),
//   onSuccess: (_, { index }) => {
//     queryClient.invalidateQueries(["addresses", customer_id]);
//     Toast.show({ type: "success", text1: "Address deleted successfully",
//       visibilityTime: 500,
//       autoHide: true,
//      });
//     deleteAddress(index);
//   },
//   onError: (error) => {
//     Toast.show({ type: "error", text1: "Delete failed", text2: error.message });
//     console.log(error);
    
//   },
// });


//   const { control, handleSubmit, reset, setValue } = useForm({
//     defaultValues: {
//       landmark: "",
//       street: "",
//       city: "Lakhimpur Kheiri",
//       state: "Uttar Pradesh",
//       zip: "262701",
//       default_address: isFirstAddress ? 1 : 0,
//     },
//   });

//   useEffect(() => {
//     if (addresses.length > 0 && !selectedAddress) {
//       const defaultOne = addresses.find((a) => a.default_address);
//       setSelectedAddress(defaultOne || addresses[0]);
//     }
//   }, [addresses]);

//   useEffect(() => {
    
    
//     if (customer_id) Getdata.mutate(getpayload);
//   }, []);

//   const openDrawer = () => setDrawerVisible(true);


  
//   const closeDrawer = () => {
//     setDrawerVisible(false);
//     setAddShow(false);
//     setEditIndex(null);
//     reset();
//     setSelectedTag(null);
//   };

//   const handleAddAddress = (data) => {
//     const payload = {
//       action: "add_address",
//       ...data,
//       title: selectedTag,
//       uid: customer_id,
//     };
//     addMutation.mutate(payload);
//   };

//   const handleEditAddress = (data) => {
//     const addressToUpdate = addresses[editIndex];
//     const payload = {
//       ...data,
//       title: selectedTag,
//       ...coordinates,
//       uid: customer_id,
//     };
//     updateMutation.mutate({ id: addressToUpdate.id, data: payload });
//   };

//   const onSubmit = (data) => {
//     if (editIndex !== null) {
//       handleEditAddress(data);
//     } else {
//       handleAddAddress(data);
//     }
//   };

//   const useCurrentLocation = async () => {
//     try {
//       setLoading(true);
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Location access is required.");
//         return;
//       }
//       const loc = await Location.getCurrentPositionAsync({});
//       setCoordinates({
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//       });
//       const [place] = await Location.reverseGeocodeAsync({
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//       });
//       if (place) {
//         setValue("street", place.street || "");
//         setValue("city", place.city || place.district || "");
//         setValue("state", place.region || "");
//         setValue("zip", place.postalCode || "");
//       }
//     } catch (err) {
//       Alert.alert("Error", "Failed to fetch location");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (index) => {
//     const addr = addresses[index];
//     setEditIndex(index);
//     setAddShow(true);
//     setSelectedTag(addr.title);
//     reset({
//       street: addr.street,
//       landmark: addr.landmark,
//       city: addr.city,
//       state: addr.state,
//       zip: addr.zip,
//       default_address: addr.default_address,
//     });
//   };

//  const handleDelete = (index) => {
//   const addr = addresses[index];
//   deleteMutation.mutate({ id: addr.id, uid: customer_id, index });
// };


//   const handleSelectAddress = (addr) => {
//     setSelectedAddress(addr);
    
//   };

//   return (
//     <View className="items-start">
 

//       {/* Address Drawer */}
//       <Modal visible={drawerVisible} animationType="slide" transparent={true}>
//         <View className="flex-1 bg-[#00000040]">
//           <View className="flex-row justify-center p-2 mt-6">
//             <TouchableOpacity onPress={closeDrawer}>
//               <Text className="border rounded-full bg-black p-1">
//                 <Entypo name="cross" size={28} color="white" />
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView className="bg-gray-100 rounded-t-2xl p-4 mt-2">
//             <Text className="font-bold text-xl mb-4">Select Delivery Location</Text>

//             {!addshow ? (
//               <>
//                 <TouchableOpacity
//                   className="bg-white p-4 rounded-lg mb-4 flex-row justify-between"
//                   onPress={() => {
//                     setAddShow(true);
//                     setEditIndex(null);
//                     reset();
//                     setSelectedTag("Home");
//                   }}
//                 >
//                   <Text className="text-green-600 font-medium text-lg">
//                     + Add new address
//                   </Text>
//                   <AntDesign name="right" size={16} color="#6b7280" />
//                 </TouchableOpacity>

//                 {addresses.length === 0 ? (
//                   <Text className="text-gray-500">No saved addresses yet.</Text>
//                 ) : (
//                   addresses.map((addr, index) => (
//                     <TouchableOpacity key={addr.id || `temp-${index}`} onPress={() => handleSelectAddress(addr)}>
//                       <View
//   className={`p-4 mb-4 rounded-xl border ${
//     selectedAddress && String(selectedAddress.id) === String(addr.id)
//       ? "bg-green-100 border-green-500"
//       : "bg-white border-gray-200"
//   }`}
// >

//                         <View className="flex-row justify-between mb-2">
//                           <Text className="font-semibold text-base">{addr.title}</Text>
                          
//                         </View>
//                         <Text className="text-gray-600 text-sm">{addr.street}, {addr.city}</Text>
//                         <Text className="text-gray-600 text-sm">{addr.state} - {addr.zip}</Text>
//                         <View className=" absolute right-0 bottom-0 m-1 flex-row space-x-4 mt-2">
//                           <TouchableOpacity onPress={() => handleEdit(index)}>
//                             <AntDesign name="edit" size={20} color="#4B5563" />
//                           </TouchableOpacity>
//                           <TouchableOpacity onPress={() => handleDelete(index)}>
//                             <AntDesign name="delete" size={20} color="#EF4444" />
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     </TouchableOpacity>
//                   ))
//                 )}
//               </>
//             ) : (
//               <View className="bg-white p-4 rounded-lg shadow-sm">
//                 <TouchableOpacity
//                   onPress={() => {
//                     setAddShow(false);
//                     setEditIndex(null);
//                     reset();
//                     setSelectedTag(null);
//                   }}
//                   className="mb-3"
//                 >
//                   <FontAwesome6 name="arrow-left" size={24} color="black" />
//                 </TouchableOpacity>

//                 {["street", "landmark", "city", "state", "zip"].map((field) => (
//                   <View key={field} className="mb-2">
//                     <Text className="text-gray-500 capitalize">{field}</Text>
//                     <Controller
//                       control={control}
//                       name={field}
//                       render={({ field: { onChange, value } }) => (
//                         <TextInput
//                           placeholder={`Enter ${field}`}
//                           value={value}
//                           onChangeText={onChange}
//                           className="border-b p-2 border-gray-300"
//                           keyboardType={field === "zip" ? "numeric" : "default"}
//                         />
//                       )}
//                     />
//                   </View>
//                 ))}

//                 <View className="flex-row justify-between my-4">
//                   {["Home", "Work", "Other"].map((tag) => (
//                     <TouchableOpacity
//                       key={tag}
//                       onPress={() => setSelectedTag(tag)}
//                       className={`flex-1 mx-1 p-2 rounded-full border ${
//                         selectedTag === tag ? "bg-green-600" : "bg-white"
//                       }`}
//                     >
//                       <Text className={`text-center font-semibold ${selectedTag === tag ? "text-white" : "text-gray-700"}`}>
//                         {tag}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 <Controller
//                   control={control}
//                   name="default_address"
//                   render={({ field: { value, onChange } }) => (
//                     <TouchableOpacity
//                       onPress={() => onChange(value === 1 ? 0 : 1)}
//                       className="flex-row items-center mb-4"
//                     >
//                       <View className={`w-5 h-5 mr-2 border rounded ${value === 1 ? "bg-green-600" : "bg-white"}`} />
//                       <Text className="text-gray-700">Set as default address</Text>
//                     </TouchableOpacity>
//                   )}
//                 />

//                 <TouchableOpacity
//                   onPress={useCurrentLocation}
//                   className="border border-gray-200 p-3 rounded-full mb-2 flex-row justify-center"
//                 >
//                   {loading ? (
//                     <ActivityIndicator color="green" />
//                   ) : (
//                     <>
//                       <MaterialIcons name="my-location" size={20} color="green" />
//                       <Text className="ml-2 text-green-600 font-bold">Use Current Location</Text>
//                     </>
//                   )}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={handleSubmit(onSubmit)}
//                   className="bg-green-600 p-3 rounded-full"
//                 >
//                   <Text className="text-white text-center font-semibold">
//                     {editIndex !== null ? "Update Address" : "Save Address"}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </ScrollView>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default ChangedAddress;



import React, { useState, useEffect, useMemo } from "react";
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
import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../Store/AuthStore";
import useAddressStore from "../Store/useAddressStore";
import axios from "axios";
import { BackendUrl2 } from "../utils/Constants";

const ChangedAddress = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addshow, setAddShow] = useState(false);
  const [coordinates, setCoordinates] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [selectedTag, setSelectedTag] = useState("Home");

  const {
    addresses,
    selectedAddress,
    setAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
  } = useAddressStore();

  const { user } = useAuthStore();
  const customer_id = user?.userId;
  const queryClient = useQueryClient();

  const isFirstAddress = useMemo(() => addresses.length === 0, [addresses]);

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      landmark: "",
      street: "",
      city: "Lakhimpur Kheiri",
      state: "Uttar Pradesh",
      zip: "262701",
      default_address: isFirstAddress ? 1 : 0,
    },
  });

  const Getdata = useMutation({
    mutationKey: ["addresses", customer_id],
    mutationFn: async (data) => {
      const res = await axios.post(`${BackendUrl2}/user/address/address.php`, data);
      return res.data;
    },
    onSuccess: (data) => {
      const formatted = (data?.data || []).map((item) => ({
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
      setAddresses(formatted);
    },
    onError: (error) => {
      console.log(error);
    },
    enabled: !!customer_id,
  });

  const addMutation = useMutation({
    mutationFn: async (data) =>
      await axios.post(`${BackendUrl2}/user/address/address.php`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["addresses", customer_id]);
      Toast.show({
        type: "success",
        text1: "Address added successfully",
        visibilityTime: 500,
        autoHide: true,
      });
      addAddress({ id: Date.now(), ...variables }); // temporary id
      closeDrawer();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: "Add failed", text2: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) =>
      await axios.post(`${BackendUrl2}/user/address/address.php`, {
        action: "update_address",
        id,
        ...data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["addresses", customer_id]);
      Toast.show({
        type: "success",
        text1: "Address updated successfully",
        visibilityTime: 500,
        autoHide: true,
      });
      updateAddress(editIndex, variables.data);
      closeDrawer();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: "Update failed", text2: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, uid }) =>
      await axios.post(`${BackendUrl2}/user/address/address.php`, {
        action: "delete_address",
        id,
        uid,
      }),
    onSuccess: (_, { index }) => {
      queryClient.invalidateQueries(["addresses", customer_id]);
      Toast.show({
        type: "success",
        text1: "Address deleted successfully",
        visibilityTime: 500,
        autoHide: true,
      });
      deleteAddress(index);
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: "Delete failed", text2: error.message });
    },
  });

  useEffect(() => {
    let isMounted = true;

    if (addresses.length > 0 && !selectedAddress && isMounted) {
      setSelectedAddress(addresses[0]);
    }

    if (customer_id) {
      const payload = {
        action: "get_address_list",
        uid: customer_id,
      };
      Getdata.mutate(payload, {
        onSuccess: (data) => {
          if (!isMounted) return;
          const formatted = (data?.data || []).map((item) => ({
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
          setAddresses(formatted);
        },
      });
    }

    return () => {
      isMounted = false;
    };
  }, [customer_id]);

  const openDrawer = () => setDrawerVisible(true);

  const closeDrawer = () => {
    setDrawerVisible(false);
    setAddShow(false);
    setEditIndex(null);
    reset();
    setSelectedTag(null);
  };

  const handleAddAddress = (data) => {
    const payload = {
      action: "add_address",
      ...data,
      title: selectedTag,
      uid: customer_id,
    };
    addMutation.mutate(payload);
  };

  const handleEditAddress = (data) => {
    const addressToUpdate = addresses[editIndex];
    const payload = {
      ...data,
      title: selectedTag,
      ...coordinates,
      uid: customer_id,
    };
    updateMutation.mutate({ id: addressToUpdate.id, data: payload });
  };

  const onSubmit = (data) => {
    if (editIndex !== null) {
      handleEditAddress(data);
    } else {
      handleAddAddress(data);
    }
  };

  const useCurrentLocation = async () => {
    let isMounted = true;
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      if (!isMounted) return;

      setCoordinates({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (place && isMounted) {
        setValue("street", place.street || "");
        setValue("city", place.city || place.district || "");
        setValue("state", place.region || "");
        setValue("zip", place.postalCode || "");
      }
    } catch (err) {
      if (isMounted) {
        Alert.alert("Error", "Failed to fetch location");
      }
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
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

  const handleDelete = (index) => {
    const addr = addresses[index];
    deleteMutation.mutate({ id: addr.id, uid: customer_id, index });
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
  };

  return (
    <View className="items-start">
         <TouchableOpacity onPress={openDrawer} className="flex-row items-center space-x-1 px-6 py-1 border border-green-500 rounded-full">
        
          
       <Text className="text-green-500 text-sm">Change Address</Text>
         
       
               
      </TouchableOpacity>

      {/* Address Drawer */}
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
            <Text className="font-bold text-xl mb-4">Select Delivery Location</Text>

            {!addshow ? (
              <>
                <TouchableOpacity
                  className="bg-white p-4 rounded-lg mb-4 flex-row justify-between"
                  onPress={() => {
                    setAddShow(true);
                    setEditIndex(null);
                    reset();
                    setSelectedTag("Home");
                  }}
                >
                  <Text className="text-green-600 font-medium text-lg">
                    + Add new address
                  </Text>
                  <AntDesign name="right" size={16} color="#6b7280" />
                </TouchableOpacity>

                {addresses.length === 0 ? (
                  <Text className="text-gray-500">No saved addresses yet.</Text>
                ) :
                (
                  addresses.map((addr, index) => {
                    const isSelected = selectedAddress?.id?.toString() === addr?.id?.toString();
                    return (
                      <TouchableOpacity key={addr.id || `temp-${index}`} onPress={() => handleSelectAddress(addr)}>
                        <View
                          className={`p-4 mb-4 rounded-xl border ${
                            isSelected ? "bg-green-100 border-green-500" : "bg-white border-gray-200"
                          }`}
                        >
                          <View className="flex-row justify-between mb-2">
                            <Text className="font-semibold text-base">{addr.title}</Text>
                          </View>
                          <Text className="text-gray-600 text-sm">{addr.street}, {addr.city}</Text>
                          <Text className="text-gray-600 text-sm">{addr.state} - {addr.zip}</Text>
                          <View className="absolute right-0 bottom-1 m-1 flex-row space-x-4 mt-2">
                            <TouchableOpacity onPress={() => handleEdit(index)}>
                              <AntDesign name="edit" size={20} color="#4B5563" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(index)}>
                              <AntDesign name="delete" size={20} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </>
            )  : (
              <View className="bg-white p-4 rounded-lg shadow-sm">
                <TouchableOpacity
                  onPress={() => {
                    setAddShow(false);
                    setEditIndex(null);
                    reset();
                    setSelectedTag(null);
                  }}
                  className="mb-3"
                >
                  <FontAwesome6 name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                {["street", "landmark", "city", "state", "zip"].map((field) => (
                  <View key={field} className="mb-2">
                    <Text className="text-gray-500 capitalize">{field}</Text>
                    <Controller
                      control={control}
                      name={field}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          placeholder={`Enter ${field}`}
                          value={value}
                          onChangeText={onChange}
                          className="border-b p-2 border-gray-300"
                          keyboardType={field === "zip" ? "numeric" : "default"}
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
                      <Text className={`text-center font-semibold ${selectedTag === tag ? "text-white" : "text-gray-700"}`}>
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
                      <View className={`w-5 h-5 mr-2 border rounded ${value === 1 ? "bg-green-600" : "bg-white"}`} />
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
                      <Text className="ml-2 text-green-600 font-bold">Use Current Location</Text>
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
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default ChangedAddress;

