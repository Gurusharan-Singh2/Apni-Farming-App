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

const CartScreen = () => {
  const {
    cart,
    increment,
    decrement,
    removeFromCart,
    clearCart,
  } = useCartStore();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = totalAmount > 1000 ? 100 : 0;
  const finalAmount = totalAmount - discount;

  const handleOrder = () => {
    if (!name || !mobile) {
      Alert.alert('Incomplete Info', 'Please enter your name and mobile number.');
      return;
    }

    Alert.alert('Order Placed', `Thanks ${name}, your order has been placed!`);
    clearCart();
    setName('');
    setMobile('');
  };

  const renderItem = ({ item }) => (
    
    <View className="flex-row gap-3   bg-white p-4 border-b border-b-gray-100  shadow">
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
  <View className='w-10' >
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
        <FlatList
          data={cart} 
          keyExtractor={(item, index) => `${item.id}-${item.selectedSize?.size}-${index}`}
          renderItem={renderItem }
          contentContainerStyle={{ padding: 16, paddingBottom: 25, }}
          ListHeaderComponent={() => (
            <>
              <View className="flex flex-row w-full justify-between px-2 mb-4">
                <LocationIcon />
                <View className="w-10 h-10 rounded-full border items-center justify-center">
                  <Ionicons name="person-outline" size={20} color="black" />
                </View>
              </View>

             
              {cart.length === 0 && (
                <Text className="text-center text-gray-500 mt-20">
                  Your cart is empty 🛒
                </Text>
              )}
            </>
          )}
          ListFooterComponent={() =>
            cart.length > 0 && (
              <>


                

                {/* Order Summary */}
                <View className="bg-white mt-4 p-4 rounded-xl shadow">
                  <Text className="font-semibold text-lg mb-2">Order Summary</Text>
                  <Text>Total: ₹{totalAmount}</Text>
                  <Text>Discount: ₹{discount}</Text>
                  <Text className="font-bold mt-2">Final: ₹{finalAmount}</Text>
                </View>

                

             

             
              </>
            )
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CartScreen;
