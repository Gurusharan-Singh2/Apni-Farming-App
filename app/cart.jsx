import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions
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
import ProfileIcon from '../components/ProfileIcon';
import EmptyOrder from '../components/EmptyOrder';
import YouMayAlsoLike from '../components/YouMayAlsoLike';
import CartReccomendation from '../components/CartReccomendation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import Back from '../components/Back';

const { width, height } = Dimensions.get('window');

const CartScreen = () => {
  const { cart, discount, finalAmount, decrement, increment, removeFromCart } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: 'row',
        gap: width * 0.03,
        marginTop: height * 0.015,
        backgroundColor: '#fff',
        padding: width * 0.02,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
    >
      <View style={{ position: 'absolute', right: width * 0.02, top: height * 0.005 }}>
        <Text style={{ fontSize: width * 0.03, fontWeight: 'bold' }}>
          {item?.quantity} X ₹ {item?.selectedSize?.sellPrice} = ₹
          {item?.quantity * item?.selectedSize?.sellPrice || 0}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#e0e0e0',
          padding: width * 0.005,
          borderRadius: width * 0.02,
        }}
      >
        <Image
          style={{
            width: width * 0.28,
            height: width * 0.28,
            borderRadius: width * 0.02,
          }}
          source={{ uri: item.image }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: width * 0.033,
            color: '#4b5563',
            fontWeight: '600',
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: width * 0.035,
            color: '#9ca3af',
            fontWeight: '600',
          }}
        >
          {item.selectedSize?.size} {item.selectedSize?.option}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            width: '82%',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: height * 0.01,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                borderRadius: width * 0.02,
                paddingHorizontal: width * 0.015,
                paddingVertical: height * 0.003,
                backgroundColor: '#D02127',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: height * 0.005,
              }}
            >
              {item?.selectedSize?.discount && (
                <Text
                  style={{
                    fontSize: width * 0.033,
                    fontWeight: '600',
                    paddingHorizontal: width * 0.01,
                    backgroundColor: '#D02127',
                    color: '#fff',
                    textDecorationLine: 'line-through',
                  }}
                >
                  ₹{item?.selectedSize?.costPrice}
                </Text>
              )}
              <Text
                style={{
                  fontSize: width * 0.035,
                  backgroundColor: '#fff',
                  marginHorizontal: width * 0.01,
                  paddingHorizontal: width * 0.02,
                  paddingVertical: height * 0.005,
                  borderRadius: width * 0.02,
                  color: '#16a34a',
                  fontWeight: 'bold',
                }}
              >
                ₹{item?.selectedSize?.sellPrice}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => removeFromCart(item?.id, item?.selectedSize?.id)}
            >
              <MaterialIcons name="delete" size={width * 0.06} color="#D02127" />
            </TouchableOpacity>
          </View>

          <View >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#16a34a',
                borderRadius: width * 0.02,
                paddingHorizontal: width * 0.015,
                paddingVertical: height * 0.005,
                width: width * 0.32,
                marginLeft: width * 0.06,
              }}
            >
              <TouchableOpacity onPress={() => decrement(item.id, item.selectedSize?.id)}>
                <Ionicons name="remove" size={width * 0.07} color="#fff" />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: width * 0.05,
                  fontWeight: '600',
                  color: '#fff',
                }}
              >
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (item?.selectedSize?.maxOrder === null) {
                    increment(item?.id, item?.selectedSize?.id);
                  } else {
                    if (item?.quantity < item?.selectedSize?.maxOrder) {
                      increment(item.id, item?.selectedSize?.id);
                    } else {
                      Toast.show({
                        type: 'error',
                        text1: 'Max Quantity Reached',
                      });
                    }
                  }
                }}
              >
                <Ionicons name="add" size={width * 0.07} color="#fff" />
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
            keyExtractor={(item, index) =>
              `${item.id}-${item.selectedSize?.size}-${index}`
            }
            renderItem={renderItem}
            contentContainerStyle={{ padding: width * 0.025 }}
            ListHeaderComponent={() => (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: height * 0.01,
                    paddingHorizontal: width * 0.02,
                  }}
                >
                  <Back title="Cart" />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: width * 0.04 }}>
                    {isLoggedIn() && <ProfileIcon />}
                  </View>
                </View>

                {cart.length === 0 && (
                  <>
                    <EmptyOrder />
                    <CartReccomendation
                      url={`${BackendUrl2}/user/products/getAllProducts.php`}
                      title={'Get Start Shopping'}
                    />
                  </>
                )}
              </>
            )}
            ListFooterComponent={
              cart.length > 0
                ? () => (
                    <YouMayAlsoLike
                      url={`${BackendUrl2}/user/products/youamyalsolike.php`}
                      title="You May Also Like"
                    />
                  )
                : null
            }
          />

          {cart.length > 0 && (
            <View
              style={{
                backgroundColor: '#fff',
                paddingHorizontal: width * 0.04,
                paddingVertical: height * 0.015,
                shadowColor: '#000',
                shadowOpacity: 0.05,
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
              }}
            >
              {isLoggedIn() ? (
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      width: width * 0.33,
                      padding: width * 0.02,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: '800',
                        color: '#000',
                        fontSize: width * 0.045,
                      }}
                    >
                      Total: ₹ {finalAmount}
                    </Text>
                    <Text
                      style={{
                        color: '#22c55e',
                        fontSize: width * 0.035,
                        fontWeight: '600',
                        marginLeft: width * 0.01,
                      }}
                    >
                      <AntDesign name="tags" size={width * 0.045} color="#22c55e" /> Saved ₹
                      {discount}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#16a34a',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: width * 0.6,
                      paddingHorizontal: width * 0.04,
                      paddingVertical: height * 0.015,
                      borderRadius: width * 0.02,
                    }}
                    onPress={() => router.push('/order')}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: width * 0.050,
                        textAlign: 'center',
                      }}
                    >
                      Go to Checkout
                    </Text>
                    <Entypo
                      name="chevron-with-circle-right"
                      size={width * 0.07}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: '#16a34a',
                    borderRadius: width * 0.02,
                    paddingHorizontal: width * 0.08,
                    paddingVertical: height * 0.02,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                  }}
                  onPress={() => router.replace('/signin')}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: width * 0.045,
                      textAlign: 'center',
                    }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CartScreen;
