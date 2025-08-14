import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { BackendUrl2 } from '../../utils/Constants';
import useAuthStore from '../../Store/AuthStore';
import useWishlistStore from '../../Store/WishlistStore';
import useCartStore from '../../Store/CartStore';

const { width: screenWidth } = Dimensions.get('window');

const CategoyComponentCard = ({ item }) => {
  const { user, isAuthenticated } = useAuthStore();
  const customer_id = user?.userId;
  const router = useRouter();

  const {
    wishlist,
    setWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlistStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item?.sizes?.[0]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { addToCart, cart, increment, decrement } = useCartStore();

  const cardWidth = Math.min(screenWidth * 0.34, ); // 40% of screen, max 170px
  const imageHeight = cardWidth ; // proportional image height
  const modalWidth = Math.min(screenWidth * 0.85, 350);

  const quantity = useMemo(() => {
    return (
      cart.find(
        (i) =>
          Number(i.id) === Number(item?.id) &&
          Number(i.selectedSize?.id) === Number(selectedSize?.id)
      )?.quantity || 0
    );
  }, [cart, item?.id, selectedSize?.id]);

  const isWishlisted = useMemo(() => {
    return wishlist?.some((w) => w.product_id == item.id);
  }, [wishlist, item.id]);

  const { refetch: refetchWishlist } = useQuery({
    queryKey: ['wishlist', customer_id],
    queryFn: async () => {
      if (!customer_id) return [];
      const res = await axios.get(
        `https://api.apnifarming.com/user/wishlists/wishlist.php?action=list&customer_id=${customer_id}`
      );
      setWishlist(res.data.data);
      return res.data.data;
    },
    onError: (error) => {
      console.error('Error fetching wishlist:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Failed to load wishlist',
        text2: error.message,
        visibilityTime: 1000,
        autoHide: true,
      });
      clearWishlist();
    },
    enabled: !!customer_id,
    staleTime: 1000 * 60 * 5,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${BackendUrl2}/user/wishlists/wishlist.php?action=add`,
        {
          customer_id,
          product_id: item.id,
        }
      );
      return res.data;
    },
    onSuccess: async () => {
      addToWishlist(item);
      refetchWishlist();
      Toast.show({
        type: 'success',
        text1: 'Added to wishlist',
        visibilityTime: 1000,
        autoHide: true,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Add failed',
        text2: error.message,
        visibilityTime: 1000,
        autoHide: true,
      });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async () =>
      await axios.post(`${BackendUrl2}/user/wishlists/wishlist.php?action=remove`, {
        customer_id,
        product_id: item.id,
      }),
    onSuccess: async () => {
      removeFromWishlist(item.id);
      refetchWishlist();
      Toast.show({
        type: 'success',
        text1: 'Removed from wishlist',
        visibilityTime: 1000,
        autoHide: true,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Remove failed',
        text2: error.message,
        visibilityTime: 1000,
        autoHide: true,
      });
    },
  });

  const handleWishlistToggle = async () => {
    if (!customer_id) {
      Toast.show({
        type: 'error',
        text1: 'Please login to manage wishlist.',
      });
      return;
    }
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlistMutation.mutateAsync();
      } else {
        await addToWishlistMutation.mutateAsync();
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...item,
      selectedSize: {
        ...selectedSize,
        id: Number(selectedSize.id),
      },
      price: selectedSize.sellPrice,
    });
    Toast.show({
      type: 'success',
      text1: 'Added to Cart!',
      text2: `${item.name} was added successfully.`,
      visibilityTime: 1000,
      autoHide: true,
    });
  };

  const handleSelectSize = (sizeObj) => {
    setSelectedSize(sizeObj);
    setModalVisible(false);
  };

  return (
    <View
      style={{
        width: cardWidth,
        marginLeft: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <TouchableOpacity
        onPress={() => router.push(`product_details/${item?.id}`)}
        style={{ position: 'relative' }}
      >
        {isAuthenticated() && (
          <TouchableOpacity
            disabled={wishlistLoading}
            onPress={handleWishlistToggle}
            style={{
              position: 'absolute',
              top: 8,
              right: 0,
              zIndex: 10,
              padding: 4,
              borderRadius: 50,
            }}
          >
            {addToWishlistMutation.isPending ||
            removeFromWishlistMutation.isPending ? (
              <AntDesign name="loading1" size={18} color="#10b981" />
            ) : (
              <AntDesign
                name={isWishlisted ? 'heart' : 'hearto'}
                size={20}
                color={isWishlisted ? '#10b981' : '#fff'}
              />
            )}
          </TouchableOpacity>
        )}

        <Image
          source={{ uri: item?.image }}
          style={{
            width: '100%',
            height: imageHeight,
            borderRadius: 8,
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>

      <Text
        style={{ fontSize: 14, fontWeight: '600', marginTop: 4 }}
        numberOfLines={1}
      >
        {item.name}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <Text style={{ color: '#047857', fontWeight: 'bold', fontSize: 14 }}>
          ₹{selectedSize?.sellPrice}
        </Text>
        {selectedSize?.discount && (
          <Text style={{ color: '#dc2626', fontSize: 12, fontWeight: 'bold' }}>
            {selectedSize?.discount}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderRadius: 6,
          paddingHorizontal: 8,
          paddingVertical: 8,
          marginBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        disabled={quantity > 0}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={{
            fontSize: 14,
            color: quantity > 0 ? '#e5e7eb' : '#374151',
          }}
        >
          {selectedSize?.size} {selectedSize?.option?.toLowerCase()}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={quantity > 0 ? '#e5e7eb' : '#6B7280'}
        />
      </TouchableOpacity>

      {quantity === 0 ? (
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            paddingVertical: 8,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: '#10b981',
          }}
          onPress={handleAddToCart}
        >
          <Text
            style={{
              color: '#10b981',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            Add to Cart
          </Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#059669',
            borderRadius: 50,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => decrement(item.id, selectedSize.id)}
          >
            <Ionicons name="remove" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={() => increment(item.id, selectedSize.id)}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              width: modalWidth,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 12,
                color: '#1f2937',
              }}
            >
              Select Size
            </Text>
            {item?.sizes?.map((sizeObj) => {
              const isSelected = selectedSize?.id === sizeObj?.id;
              return (
                <TouchableOpacity
                  key={sizeObj?.id}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    backgroundColor: isSelected ? '#d1fae5' : '#f9fafb',
                    borderWidth: isSelected ? 1 : 0,
                    borderColor: isSelected ? '#34d399' : 'transparent',
                  }}
                  onPress={() => handleSelectSize(sizeObj)}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: isSelected ? '#065f46' : '#374151',
                        fontWeight: isSelected ? 'bold' : 'normal',
                      }}
                    >
                      {sizeObj?.size} {sizeObj?.option?.toLowerCase()}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isSelected ? '#065f46' : '#4b5563',
                        fontWeight: isSelected ? 'bold' : 'normal',
                      }}
                    >
                      ₹{sizeObj?.sellPrice}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default React.memo(CategoyComponentCard);