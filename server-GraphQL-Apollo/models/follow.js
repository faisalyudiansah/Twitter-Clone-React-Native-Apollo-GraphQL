const { getDb } = require('../config/mongodb')
const { ObjectId } = require('mongodb')
const redis = require('../config/redis')

class Follow {
    static getCollection() {
        return getDb().collection("follows")
    }

    static async profileAndFollowUserLogin(whosLogin, findUser) {
        let followInfoCache = await redis.get("get:profileAndFollowInfo")
        if (followInfoCache) {
            let result = await JSON.parse(followInfoCache)
            if (result.idUserLogin === whosLogin.idLogin) {
                return result
            }
        }
        let followingInfo = await this.getCollection().aggregate([
            {
                '$match': {
                    'followerId': new ObjectId(whosLogin.idLogin)
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'followingId',
                    'foreignField': '_id',
                    'as': 'userInfo'
                }
            }, {
                '$unwind': {
                    'path': '$userInfo',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'userInfo.password': 0
                }
            }
        ]).toArray()
        let followerInfo = await this.getCollection().aggregate([
            {
                '$match': {
                    'followingId': new ObjectId(whosLogin.idLogin)
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'followerId',
                    'foreignField': '_id',
                    'as': 'userInfo'
                }
            }, {
                '$unwind': {
                    'path': '$userInfo',
                    'preserveNullAndEmptyArrays': true
                },
            }, {
                '$project': {
                    'userInfo.password': 0
                }
            }
        ]).toArray()
        let result = {
            idUserLogin: new ObjectId(whosLogin.idLogin),
            nameUserLogin: findUser.name,
            usernameUserLogin: findUser.username,
            emailUserLogin: findUser.email,
            profileImgUserLogin: findUser.profileImg,
            following: followingInfo,
            follower: followerInfo,
        }
        await redis.set("get:profileAndFollowInfo", JSON.stringify(result))
        return result
    }

    static async followAnotherUser(whosLogin, findUserToFollow) {
        const existingFollow = await this.getCollection().findOne({
            followingId: new ObjectId(findUserToFollow._id),
            followerId: new ObjectId(whosLogin.idLogin),
        })
        if (existingFollow) {
            throw new Error(`${whosLogin.usernameLogin} already followed ${findUserToFollow.username}`)
        } else {
            let newDataFollows = {
                followingId: new ObjectId(findUserToFollow._id),
                followerId: new ObjectId(whosLogin.idLogin),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            await this.getCollection().insertOne(newDataFollows)
            await redis.del("get:allusers")
            await redis.del("get:postUserLogin")
            await redis.del("get:profileAndFollowInfo")
            return { message: `${whosLogin.usernameLogin} Successfully followed ${findUserToFollow.username}` }
        }
    }
}

module.exports = Follow