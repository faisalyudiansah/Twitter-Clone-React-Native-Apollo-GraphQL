import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, useColorScheme, Alert, Keyboard } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { REGISTER_USER } from '../queries.js/register'
import { useMutation } from '@apollo/client'

const Register = ({ navigation }) => {
    let colorScheme = useColorScheme()
    let [name, setName] = useState('')
    let [username, setUsername] = useState('')
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    const [registerUser, { loading, error, data, reset }] = useMutation(REGISTER_USER)

    const registerHandler = async () => {
        try {
            await registerUser({
                variables: {
                    registerUser: {
                        name,
                        username,
                        email,
                        profileImg: `https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/13/1490989538-egg.jpg`,
                        password,
                    },
                },
            })

            Alert.alert('Success', 'Registration successful', [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('Login')
                    },
                },
            ])
        } catch (error) {
            Alert.alert('Upss!', error.message, [
                {
                    text: 'retry',
                    onPress: retryHandler(),
                },
            ])
        }
    }

    const retryHandler = () => {
        reset()
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
                        fontSize: 30,
                        fontWeight: 'bold',
                        padding: 15,
                        color: colorScheme === 'dark' ? 'white' : 'black',
                    }} >
                    Welcome to Twitter!
                </Text>
            </View>
            <View style={{
                width: "75%",
                gap: 20,
                borderRadius: 10,
            }} >
                <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor='#B4AFAE'
                    style={{
                        padding: 10,
                        color: colorScheme === 'dark' ? 'white' : 'black',
                        borderWidth: 0.8,
                        borderColor: '#00acee',
                        borderRadius: 10,
                    }} />
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor='#B4AFAE'
                    style={{
                        padding: 10,
                        color: colorScheme === 'dark' ? 'white' : 'black',
                        borderWidth: 0.8,
                        borderColor: '#00acee',
                        borderRadius: 10,
                    }} />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor='#B4AFAE'
                    style={{
                        padding: 10,
                        color: colorScheme === 'dark' ? 'white' : 'black',
                        borderWidth: 0.8,
                        borderColor: '#00acee',
                        borderRadius: 10,
                    }} />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor='#B4AFAE'
                    style={{
                        padding: 10,
                        color: colorScheme === 'dark' ? 'white' : 'black',
                        borderWidth: 0.8,
                        borderColor: '#00acee',
                        borderRadius: 10,
                    }} />
                <View style={{ gap: "30%" }}>
                    <TouchableOpacity
                        onPress={registerHandler}
                    >
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
                                Register
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={{
                        textAlign: 'center',
                        color: colorScheme === 'dark' ? 'white' : 'black',
                    }}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
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
                                Login
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}

export default Register

const styles = StyleSheet.create({})