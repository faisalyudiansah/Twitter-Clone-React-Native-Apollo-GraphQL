import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const TagsTweet = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <View style={styles.container}>
      {tags.map((tag, index) => (
        <Text key={index} style={styles.tagText}>
          #{tag}
        </Text>
      ))}
    </View>
  )
}

export default TagsTweet

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tagText: {
    color: '#00acee',
    marginRight: 8,
  },
})

