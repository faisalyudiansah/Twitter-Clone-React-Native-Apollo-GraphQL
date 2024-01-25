const { getDb } = require('../config/mongodb')
const { ObjectId } = require('mongodb')
const redis = require('../config/redis')

class Post {
    static getCollection() {
        return getDb().collection("posts")
    }

    static async getAllPosts() {
        let allPosts = await redis.get("get:allPosts")
        if (allPosts) {
            let posts = await JSON.parse(allPosts)
            return posts
        } else {
            const agg = [
                {
                    '$lookup': {
                        'from': 'users',
                        'localField': 'authorId',
                        'foreignField': '_id',
                        'as': 'authorInfo'
                    }
                }, {
                    '$unwind': {
                        'path': '$authorInfo',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$project': {
                        'authorInfo.password': 0
                    }
                }, {
                    '$sort': {
                        'createdAt': -1
                    }
                }
            ]
            let posts = await this.getCollection().aggregate(agg).toArray()
            let changeDateToString = posts.map((post) => {
                if (post.comments.length > 0) {
                    post.comments.map(data => {
                        data.createdAt = data.createdAt.toISOString()
                        data.updatedAt = data.updatedAt.toISOString()
                        return data
                    })
                }
                if (post.likes.length > 0) {
                    post.likes.map(data => {
                        data.createdAt = data.createdAt.toISOString()
                        data.updatedAt = data.updatedAt.toISOString()
                        return data
                    })
                }
                post.createdAt = post.createdAt.toISOString()
                post.updatedAt = post.updatedAt.toISOString()
                return post
            })
            await redis.set("get:allPosts", JSON.stringify(posts))
            return changeDateToString
        }
    }

    static async getPostUserLogin(userIdLogin) {
        let postUserLogin = await redis.get("get:postUserLogin")
        if (postUserLogin) {
            let posts = await JSON.parse(postUserLogin)
            if (posts.length > 0) {
                if (userIdLogin === posts[0].authorId) {
                    return posts
                }
            }
        }
        const agg = [
            {
                '$match': {
                    'authorId': new ObjectId(userIdLogin)
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'authorId',
                    'foreignField': '_id',
                    'as': 'authorInfo'
                }
            }, {
                '$unwind': {
                    'path': '$authorInfo',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$sort': {
                    'createdAt': -1
                }
            }
        ]
        let posts = await this.getCollection().aggregate(agg).toArray()
        let changeDateToString = posts.map((post) => {
            if (post.comments.length > 0) {
                post.comments.map(data => {
                    data.createdAt = data.createdAt.toISOString()
                    data.updatedAt = data.updatedAt.toISOString()
                    return data
                })
            }
            if (post.likes.length > 0) {
                post.likes.map(data => {
                    data.createdAt = data.createdAt.toISOString()
                    data.updatedAt = data.updatedAt.toISOString()
                    return data
                })
            }
            post.createdAt = post.createdAt.toISOString()
            post.updatedAt = post.updatedAt.toISOString()
            return post
        })
        await redis.set("get:postUserLogin", JSON.stringify(posts))
        return changeDateToString
    }

    static async getPostById(postId) {
        const agg = [
            {
                '$match': {
                    '_id': new ObjectId(postId)
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'authorId',
                    'foreignField': '_id',
                    'as': 'authorInfo'
                }
            }, {
                '$project': {
                    'authorInfo.password': 0
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'comments.idUser',
                    'foreignField': '_id',
                    'as': 'commentUsers'
                }
            }, {
                '$unwind': {
                    'path': '$authorInfo',
                    'preserveNullAndEmptyArrays': true
                }
            }
        ]
        let posts = await this.getCollection().aggregate(agg).toArray()
        if (posts[0].comments.length > 0) {
            posts[0].comments.map(data => {
                data.createdAt = data.createdAt.toISOString()
                data.updatedAt = data.updatedAt.toISOString()
                return data
            })
        }
        if (posts[0].likes.length > 0) {
            posts[0].likes.map(data => {
                data.createdAt = data.createdAt.toISOString()
                data.updatedAt = data.updatedAt.toISOString()
                return data
            })
        }
        posts[0].createdAt = posts[0].createdAt.toISOString()
        posts[0].updatedAt = posts[0].updatedAt.toISOString()
        return posts[0]
    }

    static async createNewPost(whosLogin, CreatePost) {
        let newPost = {
            content: CreatePost.content,
            tags: CreatePost.tags,
            imgUrl: CreatePost.imgUrl,
            authorId: new ObjectId(whosLogin.idLogin),
            comments: [],
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        await this.getCollection().insertOne(newPost)
        newPost.createdAt = newPost.createdAt.toISOString()
        newPost.updatedAt = newPost.updatedAt.toISOString()
        await redis.del("get:allPosts")
        await redis.del("get:postUserLogin")
        return newPost
    }

    static async createNewComment(findUser, data) {
        let newComment = {
            content: data.content,
            idUser: new ObjectId(findUser._id),
            name: findUser.name,
            username: findUser.username,
            email: findUser.email,
            profileImg: findUser.profileImg,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        await this.getCollection().updateOne(
            {
                _id: new ObjectId(data.idPost)
            },
            {
                $push: { comments: newComment }
            }
        )
        newComment.createdAt = newComment.createdAt.toISOString()
        newComment.updatedAt = newComment.updatedAt.toISOString()
        await redis.del("get:allPosts")
        await redis.del("get:postUserLogin")
        return newComment
    }

    static async addLike(whosLogin, postId) {
        let newLike = {
            username: whosLogin.usernameLogin,
            postId: new ObjectId(postId),
            createdAt: new Date(),
            updatedAt: new Date()
        }
        await this.getCollection().updateOne(
            {
                _id: new ObjectId(postId)
            },
            {
                $addToSet: { likes: newLike }
            }
        )
        newLike.createdAt = newLike.createdAt.toISOString()
        newLike.updatedAt = newLike.updatedAt.toISOString()
        await redis.del("get:allPosts")
        await redis.del("get:postUserLogin")
        return newLike
    }

}

module.exports = Post