import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TextInput, Image, Text, TouchableOpacity, useColorScheme, Keyboard, ActivityIndicator } from 'react-native'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import { SEARCH_USERNAME } from '../queries.js/searchUsername'
import { PROFILE_AND_FOLLOW } from '../queries.js/getProfileAndFollow'
import { FOLLOW_ANOTHER_USER } from '../queries.js/followAnotherUser'

const Search = ({ navigation }) => {
  let colorScheme = useColorScheme()
  let [searchQuery, setSearchQuery] = useState('')
  let [searchResult, setSearchResult] = useState(null)
  let [isFollowed, setIsFollowed] = useState(false)
  let [followAnotherUser, { loading: loadingFollow, error: errorFollow, data: dataFollow, reset }] = useMutation(FOLLOW_ANOTHER_USER, {
    refetchQueries: [
      PROFILE_AND_FOLLOW,
      SEARCH_USERNAME
    ],
  })
  let [searching, { loading: loadingSearch, error: errorSearch, data: dataSearch }] = useLazyQuery(SEARCH_USERNAME)
  let { loading: loadingProfileFollow, error: errorProfileFollow, data: dataProfileFollow } = useQuery(PROFILE_AND_FOLLOW)
  useEffect(() => {
    if (dataSearch && searchQuery) {
      setSearchResult(dataSearch.getUserByUsername)
    }
    if (!searchQuery) {
      setSearchResult(null)
    }
    if (errorSearch) {
      setSearchResult(null)
    }
  }, [dataSearch, errorSearch])

  let handleFollowToggle = (userId) => {
    if (!loadingFollow && !errorFollow)
      followAnotherUser({
        variables: {
          id: userId
        }
      })
        .then(() => setIsFollowed(true))
        .catch((error) => {
          Alert.alert('Upss!', error.message, [
            {
              text: 'retry',
              onPress: retryHandler,
            },
          ]);
        });
  }

  const retryHandler = () => {
    reset()
    Keyboard.dismiss()
  }

  useEffect(() => {
    if (dataSearch && dataProfileFollow) {
      const searchedUserId = dataSearch.getUserByUsername._id
      const isUserFollowed = dataProfileFollow.profileAndFollowUserLogin.following.some(
        (followedUser) => followedUser.followingId === searchedUserId
      )
      setIsFollowed(isUserFollowed)
    }
  }, [dataSearch, dataProfileFollow])


  return (
    <View style={styles.container}>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 16,
          padding: 8,
          color: colorScheme === 'dark' ? 'white' : 'black',
        }}
        placeholder="Search username..."
        placeholderTextColor='#B4AFAE'
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          if (!searchQuery) {
            searching({
              variables: {
                username: ""
              }
            })
          } else if (!loadingSearch && !errorSearch) {
            Keyboard.dismiss()
            searching({
              variables: {
                username: searchQuery
              }
            })
          }
        }}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      {loadingSearch ? (
        <View style={{
          marginTop: '12%'
        }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          {searchResult && (
            <View style={styles.cardContainer}>
              <Image
                style={styles.userImage}
                source={{ uri: searchResult.profileImg }}
              />
              <View style={styles.userInfo}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: colorScheme === 'dark' ? 'white' : 'black',
                }}>{searchResult.name}</Text>
                <Text style={styles.userUsername}>@{searchResult.username}</Text>
              </View>

              <TouchableOpacity
                style={[styles.followButton, isFollowed ? styles.followedButton : null]}
                onPress={() => handleFollowToggle(searchResult._id)}
                disabled={isFollowed}
              >
                {loadingFollow ? (
                  <View style={{
                    width: 80,
                  }}>
                    <ActivityIndicator color="white" />
                  </View>
                ) : (
                  <Text style={styles.followButtonText}>
                    {isFollowed ? 'Followed' : 'Follow'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {errorSearch && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {errorSearch.message || 'Unknown error'}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchButton: {
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
  cardContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 16,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userUsername: {
    fontSize: 16,
    color: 'gray',
  },
  followButton: {
    backgroundColor: '#00acee',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  followedButton: {
    backgroundColor: 'gray',
  },
  followButtonText: {
    textAlign: 'center',
    width: 80,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginTop: 16,
    padding: 40,
    backgroundColor: '#00acee',
    borderRadius: 10,
    alignItems: 'center'
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})