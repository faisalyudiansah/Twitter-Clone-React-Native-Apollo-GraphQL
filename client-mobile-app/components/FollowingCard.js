import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, useColorScheme, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PROFILE_AND_FOLLOW } from '../queries.js/getProfileAndFollow';
import { FOLLOW_ANOTHER_USER } from '../queries.js/followAnotherUser';
import { useMutation, useQuery } from '@apollo/client';

const FollowingCard = ({ user }) => {
    let colorScheme = useColorScheme()
    let [isFollowed, setIsFollowed] = useState(false)
    let [followAnotherUser, { loading: loadingFollow, error: errorFollow, data: dataFollow, reset }] = useMutation(FOLLOW_ANOTHER_USER, {
        refetchQueries: [
            PROFILE_AND_FOLLOW
        ],
    })
    let { loading: loadingProfileFollow, error: errorProfileFollow, data: dataProfileFollow } = useQuery(PROFILE_AND_FOLLOW)

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
        if (user && dataProfileFollow) {
            const searchedUserId = user.userInfo._id
            const isUserFollowed = dataProfileFollow.profileAndFollowUserLogin.following.some(
                (followedUser) => followedUser.followingId === searchedUserId
            )
            setIsFollowed(isUserFollowed)
        }
    }, [user, dataProfileFollow])

    return (
        <View style={styles.cardContainer}>
            <Image
                style={styles.avatar}
                source={{ uri: user.userInfo.profileImg }}
            />
            <View style={styles.userInfo}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: colorScheme === 'dark' ? 'white' : 'black',
                }}>{user.userInfo.name}</Text>
                <Text style={{
                    fontSize: 14,
                    color: "gray",
                }}>@{user.userInfo.username}</Text>
            </View>
            <TouchableOpacity
                style={[styles.followButton, isFollowed ? styles.followedButton : null]}
                onPress={() => handleFollowToggle(user.userInfo._id)}
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
    );
}

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

export default FollowingCard

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 0.3,
        borderBottomColor: 'gray',
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
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
})