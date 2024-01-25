import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Following from '../screens/Following';
import Follower from '../screens/Follower';
import Profile from '../screens/Profile';

const Tab = createMaterialTopTabNavigator()

const ProfileTopNavigation = () => {
    return (
        <Tab.Navigator
            initialRouteName='Profile'
            screenOptions={{
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                tabBarIndicatorStyle: {
                    height: 5,
                    borderRadius: 20,
                    backgroundColor: '#00acee'
                },
            }}
        >
            <Tab.Screen name="Profile" component={Profile} />
            <Tab.Screen name="Following" component={Following} />
            <Tab.Screen name="Follower" component={Follower} />
        </Tab.Navigator>
    )
}

export default ProfileTopNavigation

const styles = StyleSheet.create({})