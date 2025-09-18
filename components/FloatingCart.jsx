import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FloatingCart = ({ count = 0, onPress }) => {
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Bounce when count changes
  useEffect(() => {
    if (count > 0) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [count]);

  // Subtle pulse when cart is empty
  useEffect(() => {
    if (count === 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.10,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1); // reset if items exist
    }
  }, [count]);

  return (
    <View
      className="absolute left-0 right-0 items-center z-50"
      style={{ bottom: insets.bottom + 20 }}
    >
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }, { scale: pulseAnim }] }}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.95}
          className="bg-white border-[2.5px] border-green-500 rounded-full px-7 py-2 flex-row items-center relative"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.40,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 5,
            elevation: 6,
          }}
        >
          {/* Cart Icon */}
          <Ionicons name="cart-outline"  style={{fontWeight:'800'}} size={28} color="#22c55e" />

          {/* Cart Label */}
          <Text className="text-green-500 text-lg font-bold ml-2">
   Go To Cart
</Text>


          {/* Badge */}
          {count > 0 && (
            <View className="absolute -top-2 -right-2 bg-red-500 rounded-full px-2 py-0.5">
              <Text className="text-white text-sm font-bold">{count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default React.memo(FloatingCart);
