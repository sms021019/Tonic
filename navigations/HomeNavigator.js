import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {View, Text, SafeAreaView} from "react-native";

const Stack = createStackNavigator();

export default function HomeNavigator() {
  return (
    <SafeAreaView>
      <Text>
        Home Nav
      </Text>
    </SafeAreaView>
  )
}