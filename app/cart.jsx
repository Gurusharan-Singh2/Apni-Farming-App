// ⬅️ Your imports remain the same
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import useCartStore from '../Store/CartStore';
import { Colors } from '../assets/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import useAuthStore from '../Store/AuthStore';
import { BackendUrl2 } from '../utils/Constants';
import CartIconWithBadge from '../components/Carticon';
import ProfileIcon from '../components/ProfileIcon';
import EmptyOrder from '../components/EmptyOrder';
import YouMayAlsoLike from '../components/YouMayAlsoLike';
import CartReccomendation from '../components/CartReccomendation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import Back from '../components/Back';

const CartScreen = () => {
  const { cart, discount, finalAmount, decrement, increment,removeFromCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  
  
  const renderItem = ({ item }) => (
    
    <View className="flex-row gap-3 mt-3 bg-white p-2 border-b border-b-gray-100 shadow">
      <View className="flex-row items-center border border-gray-200 p-1 rounded-lg">
        <Image className="w-28 h-28 rounded-lg" source={{ uri: item.image }} />
      </View>

      <View>
        <Text className="text-heading-small text-gray-600 font-semibold">{item.name}</Text>
        <Text className="text-basic text-gray-400 font-semibold">
          {item.selectedSize?.size} {item.selectedSize?.option}
        </Text>

        <View className="flex-row w-[82%] items-center  justify-between  mt-2">
            <View className="flex-row self-start rounded-lg px-1 py-1  bg-[#D02127]    justify-between items-center mb-2">
            {item?.selectedSize?.discount && <Text className="text-[13px] font-semibold py-1 px-1 rounded-l-lg bg-[#D02127] text-white line-through">
              ₹{item?.selectedSize?.costPrice}
            </Text>}
            <Text className="text-[14px] bg-white mx-1 px-2 py-1 rounded  text-green-600 font-bold ">
              ₹{item?.selectedSize?.sellPrice}
            </Text>
          </View>

          <View>
            <View className="flex-row items-center justify-between bg-green-600 rounded-lg px-3 py-1 w-[100px]">
              <TouchableOpacity onPress={() => decrement(item.id, item.selectedSize?.id)}>
                <Ionicons name="remove" size={22} color="#fff" />
              </TouchableOpacity>

              <Text className="text-basic font-semibold text-white">{item.quantity}</Text>

              <TouchableOpacity onPress={() =>{
                                            if(item?.selectedSize?.maxOrder===null){
              increment(item?.id, item?.selectedSize?.id)
                                            }else{
                                              if(item?.quantity<item?.selectedSize?.maxOrder){
                        increment(item.id, item?.selectedSize?.id)
                                            }else{
                                              Toast.show({
                                                type:"error",
                                                text1:"Max Quantity Reached"
                                              })
                                            }
                                            }
                                             }}>
  <Ionicons name="add" size={22} color="#fff" />
</TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>removeFromCart(item?.id,item?.selectedSize?.id)}  className="self-end mt-3"><MaterialIcons name="delete" size={24} color="#D02127" /></TouchableOpacity>
            
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
               <View className="mb-1">
        <View className="flex flex-row w-full justify-between px-2 my-3">
          <Back title="Cart" />
          <View className="flex flex-row items-center gap-2">
            <CartIconWithBadge />
            {isAuthenticated() && <ProfileIcon />}
          </View>
        </View>
      </View>
               {cart.length === 0 && (
                <>
                   <EmptyOrder/>
                   <CartReccomendation url={`${BackendUrl2}/user/products/getAllProducts.php`} title={"Get Start Shopping"}/>
                </>
                )}   
                   
              </>
            )}

            ListFooterComponent={ cart.length > 0
      ? () => (
          <YouMayAlsoLike
            url={`${BackendUrl2}/user/products/youamyalsolike.php`}
            title="You May Also Like"
          />
        )
      : null}
          />

          {cart.length > 0 && (

          <>  
                         
<View className="bg-white px-4 py-2  shadow-lg border-t border-gray-200">
              <View className="flex flex-col gap-1 items-start">
               

               
              </View>

              <View className="mt-2">
                {isAuthenticated() ? (
                 <View className="flex-row">
                   <View className="flex justify-center w-[30%]  p-1 items-center">
                
                  <Text className="font-extrabold text-black text-heading-small">Total: ₹ {finalAmount}</Text>
                  <Text className="text-green-500 text-basic font-semibold ml-1">
                      <AntDesign name="tags" size={18} color="#22c55e" />Saved ₹{discount}
                  </Text>
                </View>
                   <TouchableOpacity
                    className="bg-green-600 flex-row justify-around w-[70%] px-5 py-5 rounded-lg"
                    onPress={() => router.push('/order')}
                  >
                     
                    <Text className="text-white  text-center font-bold text-[17px]">Go to Checkout</Text>
                    <Entypo name="chevron-with-circle-right" size={28} color="white" />
                  </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    className="bg-green-600 px-5 py-5 rounded-lg"
                    onPress={() => router.push('/signin')}
                  >
                    <Text className="text-white font-semibold text-heading-big">Login</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>  
          
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CartScreen;
