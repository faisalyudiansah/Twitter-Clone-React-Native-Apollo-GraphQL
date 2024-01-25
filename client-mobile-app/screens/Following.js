import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ImageBackground, Button, FlatList, ActivityIndicator, useColorScheme, TouchableOpacity } from 'react-native'
import { PROFILE_AND_FOLLOW } from '../queries.js/getProfileAndFollow'
import { useQuery } from '@apollo/client'
import FollowingCard from '../components/FollowingCard';

const Following = ({ navigation }) => {
  let colorScheme = useColorScheme()
  let [profileUser, setProfileUser] = useState({})
  let { loading: loadingProfileFollow, error: errorProfileFollow, data: dataProfileFollow } = useQuery(PROFILE_AND_FOLLOW)

  useEffect(() => {
    if (dataProfileFollow) {
      setProfileUser(dataProfileFollow.profileAndFollowUserLogin.following)
    }
  }, [dataProfileFollow])

  return (
    <>
      {loadingProfileFollow ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          {profileUser.length > 0 ? (
            <FlatList
              data={profileUser}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <FollowingCard user={item} />}
            />
          ) : (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20
            }}>
              <Text style={{
                color: colorScheme === 'dark' ? 'white' : 'black',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontSize: 15,
              }}>You're not following anyone</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Search')} style={{
                padding: 15,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#00acee'
              }}>
                <Text style={{
                  color: 'white',
                }}>
                  Search someone
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </>

  );
}

export default Following

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})