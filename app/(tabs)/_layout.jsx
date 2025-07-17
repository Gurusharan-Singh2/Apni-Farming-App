import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '../../assets/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from "react-native";
import * as Font from "expo-font";

const TabLayout = () => {
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
          backgroundColor: Colors.SECONDARY,
          height: 60,
          paddingBottom: Platform.OS === "ios" ? 20 : 5, // handle safe area for iOS
          borderTopWidth: 0, // removes default border
          elevation: 0,      // removes Android shadow
          
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
           fontFamily: "BebasNeue"
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="whishlist"
        options={{
          title: "Whishlist",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout