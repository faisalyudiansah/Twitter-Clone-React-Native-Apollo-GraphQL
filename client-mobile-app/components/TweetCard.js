import { StyleSheet, Text, View, Image, useColorScheme, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Feather, Ionicons, AntDesign, Octicons } from '@expo/vector-icons';
import TagsTweet from "./TagsTweet";
import { useEffect, useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { ADD_LIKE } from "../queries.js/addLike"
import { GET_POST } from "../queries.js/getAllTweet"
import { PROFILE_AND_FOLLOW } from "../queries.js/getProfileAndFollow"

const TweetCard = ({ navigation, tweet, setLoadingLikeHome }) => {
    let colorScheme = useColorScheme()
    let [liked, setLiked] = useState(false)
    const { loading: loadingProfileFollow, error: errorProfileFollow, data: dataProfileFollow } = useQuery(PROFILE_AND_FOLLOW)
    const [addNewLike, { data: dataLIKE, loading: loadingLike, error: errorLike }] = useMutation(ADD_LIKE, {
        refetchQueries: [
            GET_POST,
        ],
    })
    let likeHandler = async () => {
        try {
            setLoadingLikeHome(true)
            if (!loadingLike && !errorLike) {
                addNewLike({
                    variables: {
                        id: tweet._id
                    },
                })
            }
        } catch (errorLike) {
            alert(errorLike.message)
        } finally {
            setLoadingLikeHome(false)
        }
    }

    useEffect(() => {
        if (dataProfileFollow && tweet) {
            let userProfileUsername = dataProfileFollow.profileAndFollowUserLogin.usernameUserLogin
            let userLikedTweet = tweet.likes.some(like => like.username === userProfileUsername)
            setLiked(userLikedTweet)
        }

    }, [tweet, dataProfileFollow])

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
                        numberOfLines={3}
                        style={[styles.tweetText, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>
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
                        <TouchableOpacity onPress={() => navigation.navigate('AddComment', { tweetId: tweet._id })}>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 5,
        paddingRight: 18,
        paddingBottom: 5,
        borderBottomColor: "gray",
        borderBottomWidth: 0.3,
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
    tweetText: {
        marginTop: 3,
    },
    createdAt: {
        color: 'gray',
        fontSize: 13
    },
    tweetImage: {
        height: 180,
        width: "100%",
        borderRadius: 10,
        marginTop: 8,
    },
});

export default TweetCard;
