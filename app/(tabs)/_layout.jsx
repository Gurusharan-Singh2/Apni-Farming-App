import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '../../assets/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from "react-native";
import * as Font from "expo-font";
import useWishlistStore from '../../Store/WishlistStore';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const TabLayout = () => {
  const insets = useSafeAreaInsets(); // add this
  const { wishlist } = useWishlistStore();
const [fontsLoaded, setFontsLoaded] = useState(false);
   useEffect(() => {
    (async () => {
      await Font.loadAsync({
        BebasNeue: require("../../assets/fonts/BebasNeue-Regular.ttf"),
      });
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>

   
     <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: Colors.dark.text,
        tabBarStyle: {
          backgroundColor: Colors.SECONDARY,
          height: 60 + insets.bottom, // add bottom inset
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8, // use inset padding
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "BebasNeue",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={21} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="whishlist"
        options={{
          title: "Whishlist",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={22} color={color} />
          ),
          tabBarBadge: wishlist.length > 0 ? wishlist.length : null,
          tabBarBadgeStyle: {
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: 25,
            fontSize: 10,
            fontWeight: 'bold',
            width: 14,
          },
        }}
      />
    </Tabs>
     </SafeAreaProvider>
  );
};

export default TabLayout