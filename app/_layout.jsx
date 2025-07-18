import { useEffect, useState } from "react";
import { Text as DefaultText} from "react-native";
import { Stack } from "expo-router";
import * as Font from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import {toastConfig} from '../hooks/toastConfig'

import "../global.css";

const queryClient = new QueryClient();

export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        BebasNeue: require("../assets/fonts/Poppins-Regular.ttf"),
      });

      // ✅ GLOBAL FONT PATCH FOR ALL <Text>
      const oldRender = DefaultText.render;
      DefaultText.render = function (...args) {
        const origin = oldRender.call(this, ...args);
        return {
          ...origin,
          props: {
            ...origin.props,
            style: [{ fontFamily: "Poppins" }, origin.props?.style],
          },
        };
      };

      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        
          <Stack screenOptions={{ headerShown: false }} />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
