import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native'
import TweetCard from '../components/TweetCard'
import { useNavigation } from "@react-navigation/native";

const Tweet = ({ tweet, navigation, setLoadingLikeHome }) => {
    let { navigate } = useNavigation()
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigate('TweetDetail', { tweetId: tweet._id })}
        >
            <TweetCard tweet={tweet} navigation={navigation} setLoadingLikeHome={setLoadingLikeHome} />
        </TouchableOpacity>
    )
}

export default Tweet

const styles = StyleSheet.create({})