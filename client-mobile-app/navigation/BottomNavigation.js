import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Search from '../screens/Search'
import ProfileTopNavigation from './ProfileTopNavigation';
import Home from '../screens/Home';

const Tab = createBottomTabNavigator()

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={'#00acee'} />
          )
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={'#00acee'} />
          )
        }}
      />
      <Tab.Screen
        name="ProfileTopNavigation"
        component={ProfileTopNavigation}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <FontAwesome5 name={focused ? 'user-alt' : 'user'} size={size} color={'#00acee'} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomNavigation

const styles = StyleSheet.create({})