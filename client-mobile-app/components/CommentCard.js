import React from 'react'
import { StyleSheet, Text, View, Image, useColorScheme } from 'react-native'

const CommentCard = ({ comment }) => {
    let colorScheme = useColorScheme()
    function timeAgo(date) {
        let currentDate = new Date()
        let targetDate = new Date(date)
        let timeDifference = currentDate - targetDate

        let seconds = Math.floor(timeDifference / 1000)
        let minutes = Math.floor(seconds / 60)
        let hours = Math.floor(minutes / 60)
        let days = Math.floor(hours / 24)

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
        } else {
            return 'Just now'
        }
    }
    return (
        <View style={styles.container}>
            {/* <Image style={styles.profileImage} source={{ uri: comment.profileImg }} /> */}
            <View style={styles.commentContent}>
                <View style={styles.nameUsernameContainer}>
                    <View style={{alignItems:'center', flexDirection:'row'}}>
                        <Text style={{
                            fontWeight: 'bold',
                            marginRight: 5,
                            color: colorScheme === 'dark' ? 'white' : 'black',
                        }}>{comment.name}</Text>
                        <Text style={{
                            color: 'gray',
                        }}>@{comment.username}</Text>
                    </View>
                    <Text style={{
                        marginLeft: 5,
                        color: 'gray',
                    }}>{timeAgo(comment.createdAt)}</Text>
                </View>
                <Text numberOfLines={5} style={{
                    marginTop: 5,
                    color: colorScheme === 'dark' ? 'white' : 'black',
                }}>{comment.content}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 0.3,
        borderBottomColor: 'gray',
    },
    profileImage: {
        height: 50,
        width: 50,
        borderRadius: 30,
    },
    commentContent: {
        marginLeft: 10,
        flex: 1,
    },
    nameUsernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
    },
})

export default CommentCard
