import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity, useColorScheme, ActivityIndicator, Alert, Keyboard } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useMutation, useQuery, useApolloClient } from '@apollo/client'
import { UPDATE_PROFILEIMAGE_URL } from '../queries.js/updateProfileImageUrl'
import { GET_POST } from '../queries.js/getAllTweet'
import { PROFILE_AND_FOLLOW } from '../queries.js/getProfileAndFollow'
import { GET_TWEET_USER_LOGIN } from '../queries.js/getTweetUserLogin'

const UpdateProfileImageUrl = ({ navigation }) => {
    let colorScheme = useColorScheme()
    let route = useRoute()
    let client = useApolloClient()
    let { imageOnProfile, idUser } = route.params
    let [imageUrl, setImageUrl] = useState('')
    let [updateNewProfileImageUrl, { data, loading, error, reset }] = useMutation(UPDATE_PROFILEIMAGE_URL, {
        refetchQueries: [
            {
                query: GET_POST,
            },
            {
                query: GET_TWEET_USER_LOGIN,
            },
            {
                query: PROFILE_AND_FOLLOW
            },
        ],
    })

    const handleSave = () => {
        updateNewProfileImageUrl({
            variables: {
                updateProfileImg: {
                    _id: idUser,
                    profileImg: imageUrl,
                }
            }
        })
            .then(() => {
                client.query({ query: GET_POST })
                client.query({ query: PROFILE_AND_FOLLOW })
                client.query({ query: GET_TWEET_USER_LOGIN })
                navigation.goBack()
            })
            .catch((error) => {
                Alert.alert('Upss!', error.message, [
                    {
                        text: 'retry',
                        onPress: retryHandler(),
                    },
                ])
            })
    }

    const retryHandler = () => {
        reset()
        setImageUrl('')
        Keyboard.dismiss()
    }

    const isSaveEnabled = imageUrl.trim() === ''

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 18,
                color: colorScheme === 'dark' ? 'white' : 'black',
                fontWeight: 'bold',
                marginBottom: 16,
            }}>Update Your Profile Image URL</Text>

            <Image
                style={{
                    maxHeight: 250,
                    height: 250,
                    maxHeight: 250,
                    width: 250,
                    borderWidth: 10,
                    borderColor: 'white',
                    borderRadius: 40,
                    alignSelf: 'center',
                    marginBottom: 20,
                }}
                source={{ uri: imageOnProfile }}
            />

            <TextInput
                style={{
                    height: 40,
                    color: colorScheme === 'dark' ? 'white' : 'black',
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderRadius: 10,
                    marginBottom: 16,
                    padding: 8,
                }}
                placeholder="Enter Image URL"
                placeholderTextColor="gray"
                value={imageUrl}
                onChangeText={setImageUrl}
            />

            <TouchableOpacity
                style={[styles.saveButton, { opacity: isSaveEnabled ? 0.5 : 1 }]}
                disabled={isSaveEnabled}
                onPress={handleSave}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Save</Text>
                )}
            </TouchableOpacity>
        </View>
    )
}

export default UpdateProfileImageUrl

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    saveButton: {
        backgroundColor: '#00acee',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})

