import { StyleSheet, Text, View, Button, FlatList, useColorScheme, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import Tweet from '../components/Tweet'
import { useQuery, gql } from '@apollo/client'
import { GET_POST } from '../queries.js/getAllTweet'

const Home = ({ navigation }) => {
  let [dataTweet, setDataTweet] = useState([])
  let [refreshing, setRefreshing] = useState(false)
  let { loading, error, data, refetch } = useQuery(GET_POST)
  let colorScheme = useColorScheme()
  let [loadingLikeHome, setLoadingLikeHome] = useState(false)

  useEffect(() => {
    if (data) {
      setDataTweet(data.getAllPosts || [])
    }
  }, [data])

  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => setRefreshing(false));
  }

  return (
    <>
      {loading || loadingLikeHome ? (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View>
          {dataTweet.length > 0 ? (
            <FlatList
              data={dataTweet}
              renderItem={({ item }) => {
                return <Tweet tweet={item} setLoadingLikeHome={setLoadingLikeHome} navigation={navigation} />
              }}
              keyExtractor={(item) => item._id}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', color: colorScheme === 'dark' ? 'white' : 'black' }}>
                No posts found. Time to share your thoughts!
              </Text>
              <Button title='Tweeting' onPress={() => navigation.navigate('Tweeting')} />
            </View>
          )}
        </View>
      )}
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
})
