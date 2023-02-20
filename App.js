import Stack from "./Navigation/Stack";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import mobileAds from "react-native-google-mobile-ads";
import SplashScreen from "react-native-splash-screen";
import * as Font from "expo-font";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        mobileAds()
          .initialize()
          .then((adapterStatuses) => {
            // Initialization complete!
          });
        await Font.loadAsync(
          "Cafe24Shiningstar",
          require("./Assets/Fonts/Cafe24Shiningstar.ttf")
        );
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        SplashScreen.hide();
      }
    }

    prepare();
  }, []);
  if (!appIsReady) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack />
    </NavigationContainer>
  );
}
