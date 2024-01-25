import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, useColorScheme, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useMutation } from '@apollo/client'
import { ADD_COMMENT } from '../queries.js/createComment'
import { GET_POST } from '../queries.js/getAllTweet'
import { GET_TWEET_USER_LOGIN } from '../queries.js/getTweetUserLogin'

const AddComment = ({ navigation }) => {
  let colorScheme = useColorScheme()
  const [adNewComment, { data, loading, error, reset }] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      GET_POST,
      {
        query: GET_TWEET_USER_LOGIN,
      },
    ],
  })

  const [comment, setComment] = useState('')
  let route = useRoute()
  let tweetId = route.params.tweetId

  const handleAddComment = () => {
    if (!loading && !error) {
      adNewComment({
        variables: {
          createComment: {
            idPost: tweetId,
            content: comment,
          },
        },
      })
        .then(() => {
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
  }

  const retryHandler = () => {
    reset()
    setComment('')
    Keyboard.dismiss()
  }

  const isSubmitDisabled = comment.trim() === ''

  return (
    <View style={styles.container}>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colorScheme === 'dark' ? 'white' : 'black',
      }}>Add a Comment</Text>
      <TextInput
        style={{
          borderRadius: 10,
          padding: 10,
          marginBottom: 20,
          minHeight: 100,
          borderColor: 'gray',
          borderWidth: 1,
          color: colorScheme === 'dark' ? 'white' : 'black',
        }}
        placeholder="Type your comment here..."
        placeholderTextColor='#B4AFAE'
        multiline
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity
        style={[styles.addButton, { opacity: isSubmitDisabled ? 0.5 : 1 }]}
        onPress={() => handleAddComment()}
        disabled={isSubmitDisabled || loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.addButtonText}>Add Comment</Text>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  )
}

export default AddComment

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    backgroundColor: '#00acee',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
})
