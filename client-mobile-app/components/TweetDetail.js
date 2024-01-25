import { StyleSheet, Text, View, Image, useColorScheme, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { Feather, Ionicons, AntDesign, Octicons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import TagsTweet from "./TagsTweet"
import CommentCard from "./CommentCard"
import { GET_TWEET_BY_ID } from "../queries.js/getPostById"
import { useEffect, useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { ADD_LIKE } from "../queries.js/addLike"
import { GET_POST } from "../queries.js/getAllTweet"
import { PROFILE_AND_FOLLOW } from "../queries.js/getProfileAndFollow"

const TweetDetail = ({ navigation }) => {
    let [tweet, setTweet] = useState(null)
    let [liked, setLiked] = useState(false)
    let route = useRoute()
    let tweetId = route.params.tweetId
    let colorScheme = useColorScheme()
    let {
        loading: loadingTweetById,
        error: errorTweetById,
        data: dataTweetById,
        refetch
    } = useQuery(GET_TWEET_BY_ID, {
        variables: { id: tweetId },
    })
    const { loading: loadingProfileFollow, error: errorProfileFollow, data: dataProfileFollow } = useQuery(PROFILE_AND_FOLLOW)
    const [addNewLike, { data: dataLIKE, loading: loadingLike, error: errorLike }] = useMutation(ADD_LIKE, {
        refetchQueries: [
            GET_POST,
        ],
    })
    let likeHandler = async () => {
        try {
            if (!loadingLike && !errorLike) {
                addNewLike({
                    variables: {
                        id: tweetId
                    },
                })
                refetch()
            }
        } catch (errorLike) {
            alert(errorLike.message)
        }
    }

    useEffect(() => {
        if (dataProfileFollow && dataTweetById) {
            let userProfileUsername = dataProfileFollow.profileAndFollowUserLogin.usernameUserLogin
            let userLikedTweet = dataTweetById.getPostById.likes.some(like => like.username === userProfileUsername)
            setLiked(userLikedTweet)
        }

        if (dataTweetById && dataTweetById.getPostById) {
            setTweet(dataTweetById.getPostById);
        }
    }, [dataTweetById, dataProfileFollow])

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
        <>
            {loadingTweetById ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={[styles.container, styles.horizontal]}>
                        <ActivityIndicator size="large" />
                    </View>
                </View >
            ) : (
                <>
                    {tweet && (
                        <>
                            <View style={styles.container}>
                                <View style={styles.leftCont}>
                                    <Image
                                        style={styles.profileImage}
                                        source={{ uri: tweet.authorInfo.profileImg }}
                                    />
                                </View>
                                <View style={styles.rightCont}>
                                    <View style={styles.topCont}>
                                        <View style={styles.nameCont}>
                                            <Text
                                                numberOfLines={1}
                                                style={[styles.nameText, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>
                                                {tweet.authorInfo.name}
                                            </Text>
                                            <Text numberOfLines={1} style={styles.idText}>@{tweet.authorInfo.username}</Text>
                                        </View>
                                        <Text style={styles.createdAt}>{timeAgo(tweet.createdAt)}</Text>
                                    </View>
                                    <View style={styles.tweetCont}>
                                        <Text
                                            style={{ marginTop: 3, color: colorScheme === 'dark' ? 'white' : 'black' }}>
                                            {tweet.content}
                                        </Text>
                                        <TagsTweet tags={tweet.tags} />
                                        {tweet.imgUrl && (
                                            <Image
                                                style={styles.tweetImage}
                                                source={{ uri: tweet.imgUrl }}
                                            />
                                        )}
                                    </View>
                                    <View style={styles.actionCont}>
                                        <View style={styles.iconCont}>
                                            <TouchableOpacity onPress={() => navigation.navigate('AddComment', { tweetId })}>
                                                <Octicons
                                                    name="reply"
                                                    color="gray"
                                                    size={20}
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.idText}>{tweet.comments.length}</Text>
                                        </View>
                                        <View style={styles.iconCont}>
                                            <TouchableOpacity onPress={() => Alert.alert('Retweet', 'Retweeting is not mandatory, sorry for the inconvenience!')}>
                                                <AntDesign
                                                    name="retweet"
                                                    color="gray"
                                                    size={20}
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.idText}></Text>
                                        </View>
                                        <View style={styles.iconCont}>
                                            <TouchableOpacity onPress={likeHandler} disabled={liked}>
                                                {loadingLike ? (
                                                    <ActivityIndicator size='small' color='gray' />
                                                ) : (
                                                    <>
                                                        {liked ? (
                                                            <Ionicons
                                                                name="heart"
                                                                color="red"
                                                                size={20}
                                                            />
                                                        ) : (
                                                            <Ionicons
                                                                name="heart-outline"
                                                                color="gray"
                                                                size={20}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                            <Text style={styles.idText}>{tweet.likes.length}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => alert('Thankyou For Sharing')}>
                                            <Feather
                                                name="share"
                                                color="gray"
                                                size={19}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.addCommentButton}
                                onPress={() => navigation.navigate('AddComment', { tweetId })}
                            >
                                <Text style={styles.addCommentButtonText}>Add Comment</Text>
                            </TouchableOpacity>
                            {tweet.comments.length > 0 && (
                                <FlatList
                                    data={tweet.comments}
                                    keyExtractor={(item) => item.idUser}
                                    renderItem={({ item }) => <CommentCard comment={item} />}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 5,
        paddingRight: 18,
        paddingBottom: 5,
    },
    leftCont: {
        padding: 8,
    },
    profileImage: {
        height: 50,
        width: 50,
        borderRadius: 30,
    },
    rightCont: {
        flex: 1,
        paddingTop: 6,
        paddingBottom: 5,
        marginLeft: 5,
        flexDirection: "column",
    },
    nameCont: {
        flexDirection: "row",
    },
    actionCont: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        marginRight: 35,
        marginLeft: 35,
    },
    iconCont: {
        flexDirection: "row",
        alignItems: 'center'
    },
    topCont: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    nameText: {
        fontWeight: "bold",
        marginRight: 2,
    },
    idText: {
        marginLeft: 5,
        color: "gray",
    },
    createdAt: {
        color: 'gray',
        fontSize: 13
    },
    tweetImage: {
        maxHeight: 300,
        height: 300,
        width: "100%",
        borderRadius: 10,
        marginTop: 12,
    },
    addCommentButton: {
        backgroundColor: '#00acee',
        padding: 10,
        alignItems: 'center',
    },
    addCommentButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default TweetDetail
