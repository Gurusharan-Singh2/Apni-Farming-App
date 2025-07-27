import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCartStore from '../Store/CartStore';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishListItem = ({ item }) => {
  const { cart, addToCart, increment, decrement,  clearCart } = useCartStore();
  const [modalVisible, setModalVisible] = useState(false);

  
  
 
 const [selectedSize, setSelectedSize] = useState(null);

  
    useEffect(() => {
      if (item?.sizes && item?.sizes.length > 0) {
        setSelectedSize(item.sizes[0]);
      }
    }, [item]);

const quantity = useMemo(() => {
  return cart.find(
    (i) =>
      Number(i.id) === Number(item?.product_id) &&
      Number(i.selectedSize?.id) === Number(selectedSize?.id)
  )?.quantity || 0;
}, [cart, item?.product_id, selectedSize?.id]);

  


const handleAddToCart = () => {
  const selectedSize = item?.sizes?.[0]; // or any selected size based on user input

  if (!selectedSize) return;

  addToCart({
    id: item.product_id, // normalize here
    product_id: item.product_id,
    name: item.name,
    image: item.image,
    selectedSize: {
      ...selectedSize,
      id: Number(selectedSize.id),
      costPrice: Number(selectedSize.costPrice),
      sellPrice: Number(selectedSize.sellPrice),
    },
  });

  Toast.show({
    type: 'success',
    text1: 'Added to Cart!',
    text2: `${item.name} was added successfully.`,
    visibilityTime: 1000,
    autoHide: true,
  });
};



    
    
    

  
  

  
   const handleSelectSize = (size) => {
    setSelectedSize(size);
    setModalVisible(false);
  };

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
            <Text className="text-gray-900 font-semibold text-[14px] mb-1" numberOfLines={2}>
              {item.name}
            </Text>

            <Text className="text-heading-small mb-1 text-green-600 font-bold ">
                                         {selectedSize?.discount}
                                       </Text>
                     
                                  <View className="flex-row self-start rounded-lg px-1 py-1  bg-[#D02127]    justify-between items-center mb-2">
                                   {selectedSize?.discount && <Text className="text-[13px] font-semibold py-1 px-1 rounded-l-lg bg-[#D02127] text-white line-through">
                                     ₹{selectedSize?.costPrice}
                                   </Text>}
                                   <Text className="text-[14px] bg-white mx-1 px-2 py-1 rounded  text-green-600 font-bold ">
                                     ₹{selectedSize?.sellPrice}
                                   </Text>
                                 </View>
          </View>

         {quantity===0 ? (

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
                                 onPress={handleAddToCart}

                               >
                                 <Text className="text-green-500 text-[14px] font-bold">Add</Text>
                               </TouchableOpacity>
                            </View>
                           ) : (
                            
                           <View className="flex-row items-center">
                               <View className="flex-row items-center justify-between bg-green-600 rounded-full px-2 py-2 min-w-[100px]">
                                 <TouchableOpacity onPress={() => decrement(item.product_id, selectedSize.id)}>
                                   <Ionicons name="remove" size={24} color="#fff" />
                                 </TouchableOpacity>
                                 <Text className="text-white text-[14px] font-semibold px-2">{quantity}</Text>
                                 <TouchableOpacity onPress={() => increment(item.product_id, selectedSize.id)}>
                                   <Ionicons name="add" size={24} color="#fff" />
                                 </TouchableOpacity>
                               </View>
                             </View>
                           )}
        </View>
      </View>

      {/* Size Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-xl p-4 w-[85%] max-w-[320px]">
            <Text className="text-lg font-bold mb-3 text-gray-800">Select Size</Text>
            {item.sizes?.map((sizeObj) => {
              const isSelected =
                selectedSize?.size === sizeObj.size;

              return (
                <TouchableOpacity
                  key={sizeObj.id}
                  className={`py-3 px-3 rounded-lg mb-2 ${
                    isSelected ? 'bg-green-100 border border-green-400' : 'bg-gray-50'
                  }`}
                  onPress={() => handleSelectSize(sizeObj)}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`text-sm ${
                        isSelected ? 'text-green-800 font-bold' : 'text-gray-700'
                      }`}
                    >
                      {sizeObj.size+" "+sizeObj.option?.toLowerCase()}
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
    </>
  );
};

export default WishListItem;