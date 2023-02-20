import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Home from "../Screens/Home";
import Like from "../Screens/Like";
const NativeStack = createNativeStackNavigator();

const Stack = ({ navigation }) => (
  <NativeStack.Navigator screenOptions={{ headerShown: false }}>
    <NativeStack.Screen name="Home" component={Home} />
    <NativeStack.Screen name="Like" component={Like} />
  </NativeStack.Navigator>
);

export default Stack;
