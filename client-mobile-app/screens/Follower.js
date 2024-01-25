import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, ActivityIndicator, useColorScheme, TouchableOpacity } from 'react-native'
import { PROFILE_AND_FOLLOW } from '../queries.js/getProfileAndFollow'
import { useQuery } from '@apollo/client'
import FollowerCard from '../components/FollowerCard';

const Follower = () => {
  let colorScheme = useColorScheme()
  let [profileUser, setProfileUser] = useState({})
  let { loading: loadingProfileFollow, error: errorProfileFollow, data: dataProfileFollow } = useQuery(PROFILE_AND_FOLLOW)

  useEffect(() => {
    if (dataProfileFollow) {
      setProfileUser(dataProfileFollow.profileAndFollowUserLogin.follower)
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
              renderItem={({ item }) => <FollowerCard user={item} />}
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
              }}>You don't have any followers</Text>
            </View>
          )}
        </View>
      )}
    </>
  );
}

export default Follower

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})