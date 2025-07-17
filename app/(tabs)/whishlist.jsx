import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import useCartStore from '../../Store/CartStore';
import LocationIcon from '../../components/LocationIcon';
import { Colors } from '../../assets/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import useAuthStore from '../../Store/AuthStore';
import ProfileIcon from '../../components/ProfileIcon';


const CartScreen = () => {
  const {
    cart,
    increment,
    decrement,
    
  } = useCartStore();
  

  const {isAuthenticated}= useAuthStore();
 
 const router=useRouter();
  

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cart.reduce((sum, item) => sum + (item.selectedSize.costPrice-item.selectedSize.sellPrice)*item.quantity , 0);
  const finalAmount = totalAmount - discount;



  const renderItem = ({ item }) => (
    
    <View className="flex-row gap-3   bg-white p-2 border-b border-b-gray-100  shadow">
      <View className="flex-row items-center  border border-gray-200 p-1 rounded-lg ">
        <Image className=" w-28 h-28 rounded-lg "
      source={{ uri: item.image }}/>

      </View>
      <View className="">
         <Text className="text-sm text-gray-600 font-semibold">
  {item.name}
</Text>
         <Text className="text-xs text-gray-400 font-semibold">
  {item.selectedSize?.size} {item.selectedSize?.option}
</Text>
<View className="flex-row gap-24 justify-between items-end mt-2">
  <View className='w-14' >
 <Text className="text-lg text-black font-extrabold">
  ₹ {item.selectedSize?.sellPrice}
</Text>
         <Text className="text-xs line-through text-gray-500 font-semibold">
  ₹{item.selectedSize?.costPrice}
</Text>
  </View>
  <View>
 <View className="flex-row items-center justify-between   bg-green-600 rounded-lg px-3 py-1 w-[100px] ">
  <TouchableOpacity onPress={() => decrement(item.id)}>
    <Ionicons name="remove" size={22} color="#fff" />
  </TouchableOpacity>

  <Text className="text-base font-semibold text-white">{item.quantity}</Text>

  <TouchableOpacity onPress={() => increment(item.id)}>
    <Ionicons name="add" size={22} color="#fff" />
  </TouchableOpacity>
</View>
  </View>
 

</View>
        

      </View>
    
    </View>
  );

  
  

 return (
  <SafeAreaView style={{ flex: 1, backgroundColor: Colors.SECONDARY }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={cart}
          keyExtractor={(item, index) => `${item.id}-${item.selectedSize?.size}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={() => (
            <>
              <View className="flex flex-row w-full justify-between px-2 mb-4">
                <LocationIcon />
                 {isAuthenticated() && <ProfileIcon/> } 
              </View>

              {cart.length === 0 && (
                <Text className="text-center text-gray-500 mt-20">
                  Your cart is empty 🛒
                </Text>
              )}
            </>
          )}
        />

        {/* ✅ Fixed Footer at bottom */}
        {cart.length > 0 && (
          // <View className="bg-white p-4 shadow-lg border-t border-gray-200">
          //   <View className="mb-2">
          //     <Text className="font-semibold text-lg">Order Summary</Text>
          //     <Text>Total: ₹{totalAmount}</Text>
          //     <Text>Discount: ₹{discount}</Text>
          //     <Text className="font-bold mt-1">Final: ₹{finalAmount}</Text>
          //   </View>

          //   <View className="flex flex-col gap-2">
          //     <TextInput
          //       placeholder="Your Name"
          //       value={name}
          //       onChangeText={setName}
          //       className="border p-2 rounded-md"
          //     />
          //     <TextInput
          //       placeholder="Mobile Number"
          //       keyboardType="phone-pad"
          //       value={mobile}
          //       onChangeText={setMobile}
          //       className="border p-2 rounded-md"
          //     />
          //     <TouchableOpacity
          //       onPress={handleOrder}
          //       className="bg-green-600 p-3 rounded-md"
          //     >
          //       <Text className="text-white text-center font-bold">Place Order</Text>
          //     </TouchableOpacity>
          //   </View>
          // </View>
          <View className="bg-white px-4 py-2 shadow-lg border-t border-gray-200 flex-row justify-between items-center">
            
              <View className="flex flex-col gap-1 items-start">
                <View><Text className="font-extrabold text-lg">Total: ₹ {finalAmount} </Text></View>
                <View className="flex-row bg-green-100 p-1"><AntDesign name="tags" size={20} color="#22c55e" /><Text className="text-green-500 text-xs font-semibold">Saved ₹{discount}</Text></View>
                </View>
              <View>{isAuthenticated() ?<TouchableOpacity className="bg-green-600 px-5 py-2 rounded-lg  " onPress={()=>router.push('/offers')}><Text className="text-white font-semibold  text-base">Order Placed</Text></TouchableOpacity>:<TouchableOpacity className="bg-green-600 px-5 py-2 rounded-lg  " onPress={()=>router.push('/signin')}><Text className="text-white font-semibold  text-base">Login</Text></TouchableOpacity>}</View>
              

          </View>

        )}
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

};

export default CartScreen;
