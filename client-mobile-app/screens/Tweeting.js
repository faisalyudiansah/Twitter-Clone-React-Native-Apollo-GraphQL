import React, { useState } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Text, useColorScheme, Keyboard } from 'react-native'
import { NEW_TWEET } from '../queries.js/addNewTweet'
import { GET_POST } from '../queries.js/getAllTweet'
import { useMutation } from '@apollo/client'
import { GET_TWEET_USER_LOGIN } from '../queries.js/getTweetUserLogin'

const Tweeting = ({ navigation }) => {
  let colorScheme = useColorScheme()
  const [tweetContent, setTweetContent] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [tags, setTags] = useState('')
  const [addNewTweet, { loading, error, data, reset }] = useMutation(NEW_TWEET, {
    refetchQueries: [
      GET_POST,
      {
        query: GET_TWEET_USER_LOGIN,
      },
    ],
  })

  const handleTweetSubmit = () => {
    if (tweetContent.trim() === '') {
      Alert.alert("Something's wrong", 'Tweet cannot be empty. Please enter some text before posting')
      return
    }

    const tagsArray = tags.trim() !== '' ? tags.split(' ') : []
    if (!loading && !error) {
      addNewTweet({
        variables: {
          createPost: {
            content: tweetContent,
            imgUrl: imageURL,
            tags: tagsArray,
          }
        }
      })
        .then(() => navigation.goBack())
        .catch((error) => {
          Alert.alert('Upss!', error.message, [
            {
              text: 'retry',
              onPress: retryHandler,
            },
          ]);
        });
    }
  }

  const retryHandler = () => {
    reset()
    Keyboard.dismiss()
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: colorScheme === 'dark' ? 'white' : 'black',
        marginBottom: 8,
      }}>Let's make a new tweet!</Text>
      <Text style={styles.subHeaderText}>Halo, what's happening today?</Text>

      <TextInput
        style={{
          height: 120,
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 16,
          color: colorScheme === 'dark' ? 'white' : 'black',
          padding: 8,
        }}
        placeholder="Your tweet..."
        placeholderTextColor='gray'
        multiline
        numberOfLines={4}
        value={tweetContent}
        onChangeText={(text) => setTweetContent(text)}
        maxLength={280}
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
        placeholder="Image URL (optional)"
        placeholderTextColor='gray'
        value={imageURL}
        onChangeText={(text) => setImageURL(text)}
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
        placeholder="Tags (separate with space)"
        placeholderTextColor='gray'
        value={tags}
        onChangeText={(text) => setTags(text)}
      />

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleTweetSubmit}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Tweet</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subHeaderText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  buttonContainer: {
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

export default Tweeting
