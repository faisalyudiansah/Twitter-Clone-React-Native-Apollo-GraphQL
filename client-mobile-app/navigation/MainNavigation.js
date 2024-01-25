import { StyleSheet, StatusBar, Text, View, Alert, useColorScheme, TouchableOpacity } from 'react-native'
import { NavigationContainer, DarkTheme, DefaultTheme, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FontAwesome5 } from '@expo/vector-icons'
import Register from '../screens/Register'
import Login from '../screens/Login'
import Tweeting from '../screens/Tweeting'
import BottomNavigation from './BottomNavigation'
import TweetDetail from '../components/TweetDetail'
import AddComment from '../screens/AddComment'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getValueFor } from '../helpers/secureStore'
import * as SecureStore from 'expo-secure-store'
import client from '../config/apolloClient'
import UpdateProfileImageUrl from '../screens/UpdateProfileImageUrl'

const Stack = createNativeStackNavigator()

const MainNavigation = ({ navigation }) => {
  let authContext = useContext(AuthContext)
  let colorScheme = useColorScheme()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getValueFor('access_token')
      .then(result => {
        if (result) {
          authContext.setIsSignedIn(true)
        } else {
          authContext.setIsSignedIn(false)
        }
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(false)
        console.log('Error from main navigation: ', error)
      })
  }, [])

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isLoading ?
        <>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
          }}>
            <FontAwesome5 name='twitter' size={60} color={'#00acee'} />
          </View>
        </> : <>
          <StatusBar style='auto' />
          <Stack.Navigator
            screenOptions={{
              headerTitle: ({ size, color }) => (
                <FontAwesome5 name='twitter' size={27} color={'#00acee'} />
              ),
            }}>
            {authContext.isSignedIn ?
              <>
                <Stack.Screen
                  name="BottomNavigation"
                  component={BottomNavigation}
                  options={({ navigation, route }) => ({
                    headerBackVisible: false,
                    headerLeft: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('Tweeting')}>
                        <Text style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          color: '#00acee',
                        }}>Tweet</Text>
                      </TouchableOpacity>
                    ),
                    headerRight: () => (
                      <TouchableOpacity onPress={() => {
                        Alert.alert(
                          'Logout',
                          'Are you sure you want to logout?',
                          [
                            {
                              text: 'Logout',
                              onPress: () => {
                                SecureStore.deleteItemAsync('access_token')
                                  .then(() => {
                                    authContext.setIsSignedIn(false)
                                  })
                                  .then(() => client.clearStore())
                                  .catch(error => {
                                    console.log(error)
                                  })
                              },
                            },
                            {
                              text: 'Cancel',
                            },
                          ],
                          { cancelable: true }
                        )
                      }}>
                        <Text style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          color: '#00acee',
                        }}>Logout</Text>
                      </TouchableOpacity>
                    ),
                  })}
                />
                <Stack.Screen
                  name="Tweeting"
                  component={Tweeting}
                  options={{
                    headerBackTitle: 'Cancel'
                  }}
                />
                <Stack.Screen
                  name="TweetDetail"
                  component={TweetDetail}
                  options={{
                    headerBackTitle: 'Back'
                  }}
                />
                <Stack.Screen
                  name="AddComment"
                  component={AddComment}
                  options={{
                    headerBackTitle: 'Cancel'
                  }}
                />
                <Stack.Screen
                  name="UpdateProfileImageUrl"
                  component={UpdateProfileImageUrl}
                  options={{
                    headerBackTitle: 'Cancel'
                  }}
                />
              </> : <>
                <Stack.Screen
                  name="Login"
                  component={Login}
                />
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{
                    headerBackVisible: false
                  }}
                />
              </>
            }
          </Stack.Navigator>
        </>
      }
    </NavigationContainer >
  )
}

export default MainNavigation

const styles = StyleSheet.create({})