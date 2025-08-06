import { View, Text, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../assets/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Font from 'expo-font';
import useWishlistStore from '../../Store/WishlistStore';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const TabLayout = () => {
  const insets = useSafeAreaInsets();
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
    
      <Tabs
        screenOptions={{
          headerShown: false,
          
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarInactiveTintColor: Colors.dark.text,
          tabBarStyle: {
            
            paddingHorizontal: 1,
            paddingRight:5,
            backgroundColor: Colors.SECONDARY,
            height: 60 + insets.bottom,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 1,

            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarItemStyle: {
              flex: 1,           
                  
      marginHorizontal: -4,
            paddingHorizontal: 2, 
          },
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: "bold",
            fontFamily: "BebasNeue",
            marginLeft: 2, // adjust space between icon and label
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
            tabBarIcon: ({ color }) => (
              <Ionicons name="grid-outline" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="whishlist"
          options={{
            title: "Wishlist",
            tabBarIcon: ({ color }) => (
              <Feather name="heart" size={20} color={color} />
            ),
            tabBarBadge: wishlist.length > 0 ? wishlist.length : null,
            tabBarBadgeStyle: {
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: 25,
              fontSize: 10,
              fontWeight: 'bold',
              minWidth: 14,
              textAlign: 'center',
            },
          }}
        />
        
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color }) => (
              <Ionicons name="receipt-outline" size={20} color={color} />
            ),
          }}
        />
       
      </Tabs>
 
  );
};

export default TabLayout;
