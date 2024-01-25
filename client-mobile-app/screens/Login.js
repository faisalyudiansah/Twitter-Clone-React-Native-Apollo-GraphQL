import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, useColorScheme, Alert, Keyboard } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { gql, useMutation } from '@apollo/client'
import { getValueFor, save } from '../helpers/secureStore';

const LOGIN_USER = gql`
    mutation Mutation($loginUser: LoginUser) {
        login(LoginUser: $loginUser) {
            access_token
        }
    }
`

const Login = ({ navigation }) => {
    let authContext = useContext(AuthContext)
    let colorScheme = useColorScheme()
    const [login, { loading, error, data, reset }] = useMutation(LOGIN_USER)
    let [username, setUsername] = useState('')
    let [password, setPassword] = useState('')

    useEffect(() => {
        if (data && !error) {
            save('access_token', data.login.access_token)
                .then(() => {
                    authContext.setIsSignedIn(true)
                })
        }
    }, [data])

    const retryHandler = () => {
        reset()
        setUsername('')
        setPassword('')
        Keyboard.dismiss()
    }

    return (
        <View
            style={{
                flex: 1,
                gap: '80%',
                marginBottom: 80,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <View>
                <Text
                    style={{
                        fontSize: 40,
                        fontWeight: 'bold',
                        padding: 15,
                        color: colorScheme === 'dark' ? 'white' : 'black',
                    }} >
                    See what's happening in the world right now.
                </Text>
            </View>
            <View style={{
                width: "75%",
                gap: 30,
                borderRadius: 10,
            }} >
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor='#B4AFAE'
                    style={{
                        padding: 10,
                        borderWidth: 0.8,
                        color: colorScheme === 'dark' ? 'white' : 'black',
                        borderColor: '#00acee',
                        borderRadius: 10,
                    }} />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor='#B4AFAE'
                    secureTextEntry
                    style={{
                        padding: 10,
                        borderWidth: 0.8,
                        color: colorScheme === 'dark' ? 'white' : 'black',
                        borderColor: '#00acee',
                        borderRadius: 10,
                    }} />
                <View style={{ gap: "30%" }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (!loading) {
                                login({
                                    variables: {
                                        loginUser: {
                                            username: username,
                                            password: password
                                        }
                                    }
                                })
                                .catch((error) => {
                                    Alert.alert('Upss!', error.message, [
                                        {
                                            text: 'retry',
                                            onPress: retryHandler,
                                        },
                                    ]);
                                });
                            }
                        }}>
                        <View style={{
                            borderRadius: 30,
                            alignItems: 'center',
                            backgroundColor: '#00acee',
                            padding: 15
                        }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: 15
                                }}>
                                Login
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{
                        textAlign: 'center',
                        color: colorScheme === 'dark' ? 'white' : 'black',
                    }}>
                        Don't have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                    >
                        <View style={{
                            borderRadius: 30,
                            alignItems: 'center',
                            borderWidth: 1.3,
                            borderColor: '#00acee',
                            padding: 15
                        }}>
                            <Text
                                style={{
                                    color: '#00acee',
                                    fontWeight: 'bold',
                                    fontSize: 15
                                }}>
                                Register
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}

export default Login

const styles = StyleSheet.create({})