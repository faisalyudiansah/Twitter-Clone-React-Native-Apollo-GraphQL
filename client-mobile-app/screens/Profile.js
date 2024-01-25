import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, ActivityIndicator, useColorScheme, TouchableOpacity, RefreshControl } from 'react-native'
import Tweet from '../components/Tweet'
import { PROFILE_AND_FOLLOW } from '../queries.js/getProfileAndFollow'
import { useQuery } from '@apollo/client'
import { GET_TWEET_USER_LOGIN } from '../queries.js/getTweetUserLogin'

const Profile = ({ navigation }) => {
  let colorScheme = useColorScheme()
  let [profileUser, setProfileUser] = useState({})
  let [tweetUserLogin, setTweetUserLogin] = useState([])
  let [refreshing, setRefreshing] = useState(false)
  const { loading: loadingProfileFollow, error: errorProfileFollow, data: dataProfileFollow } = useQuery(PROFILE_AND_FOLLOW)
  const { loading: loadingTweetUserLogin, error: errorTweetUserLogin, data: dataTweetUserLogin, refetch } = useQuery(GET_TWEET_USER_LOGIN)

  useEffect(() => {
    if (dataProfileFollow) {
      setProfileUser(dataProfileFollow.profileAndFollowUserLogin)
    }
    if (dataTweetUserLogin) {
      setTweetUserLogin(dataTweetUserLogin.getPostUserLogin)
    }
  }, [dataProfileFollow, dataTweetUserLogin])

  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => setRefreshing(false));
  }

  return (
    <>
      {loadingProfileFollow && tweetUserLogin && loadingTweetUserLogin ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={{ uri: profileUser.profileImgUserLogin }}
            style={{ height: 150 }}
          >
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingTop: '8%', flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingloadingContainer: 10 }}>
                <Image
                  style={{ height: 100, marginLeft: '4%', borderWidth: 1, borderColor: 'white', width: 100, borderRadius: 50 }}
                  source={{ uri: profileUser.profileImgUserLogin }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>{profileUser.nameUserLogin}</Text>
                  <Text style={{ fontSize: 15, color: 'white' }}>@{profileUser.usernameUserLogin}</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('UpdateProfileImageUrl', {
                      imageOnProfile: profileUser.profileImgUserLogin,
                      idUser: profileUser.idUserLogin
                    })}
                    style={{
                      backgroundColor: '#00acee',
                      padding: 10,
                      marginTop: '7%',
                      borderRadius: 30,
                    }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'white' }}>Update Photo Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#00acee',
          }}>
            <TouchableOpacity onPress={() => navigation.navigate('Following')} style={{
              flex: 1,
              alignItems: 'center',
              paddingRight: 10,
              padding: 10,
              borderRightWidth: 2,
              borderColor: colorScheme === 'dark' ? 'black' : 'white',
              backgroundColor: '#00acee',
            }}>
              <View >
                <Text style={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Following</Text>
                <Text style={{ color: 'white', textAlign: 'center' }}>{profileUser.following?.length}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Follower')} style={{
              flex: 1,
              alignItems: 'center',
              paddingLeft: 10,
              padding: 10,
            }}>
              <View >
                <Text style={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Followers</Text>
                <Text style={{ color: 'white', textAlign: 'center' }}>{profileUser.follower?.length}</Text>
              </View>
            </TouchableOpacity>

          </View>

          <View style={{ flex: 1 }}>
            {loadingTweetUserLogin ? (
              <ActivityIndicator style={{ flex: 1 }} size="large" />
            ) : tweetUserLogin.length === 0 ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: 'gray' }}>It seems a bit quiet here...</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Tweeting')} style={{
                  padding: 10,
                  marginTop: 20,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#00acee'
                }}>
                  <Text style={{ color: 'white' }}>Create a Tweet</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={tweetUserLogin}
                renderItem={({ item }) => <Tweet tweet={item} />}
                keyExtractor={(item) => item._id}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              />
            )}
          </View>
        </View>
      )}
    </>
  )
}

export default Profile

const styles = StyleSheet.create({})
