const Post = require('../models/post')
const User = require('../models/user')
const validator = require('validator')

const resolvers = {
    Query: {
        getAllPosts: async (parent, args, contextValue, info) => {
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let getAllPost = await Post.getAllPosts()
            return getAllPost
        },
        getPostById: async (parent, args, contextValue, info) => {
            let requiredPostId = validator.isEmpty(args._id)
            if(requiredPostId){
                throw new Error("Post id is required")
            }
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let findPost = await Post.getPostById(args._id)
            return findPost
        },
        getPostUserLogin: async (parent, args, contextValue, info) => {
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let getPost = await Post.getPostUserLogin(whosLogin.idLogin)
            return getPost
        }
    },
    Mutation: {
        createNewPost: async (parent, args, contextValue, info) => {
            let { CreatePost } = args
            let requiredContent = validator.isEmpty(CreatePost.content)
            if(requiredContent){
                throw new Error("Content post is required")
            }
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let result = await Post.createNewPost(whosLogin, CreatePost)
            return result
        },
        createNewComment: async (parent, args, contextValue, info) => {
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let requiredComment = validator.isEmpty(args.CreateComment.content)
            if(requiredComment){
                throw new Error("Comment is required")
            }
            let findUser = await User.getUserById(whosLogin.idLogin)
            let result = await Post.createNewComment(findUser, args.CreateComment)
            return result
        },
        addLike: async (parent, args, contextValue, info) => {
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let requiredIdPost = validator.isEmpty(args._id)
            if(requiredIdPost){
                throw new Error("Post id is required")
            }
            let result = await Post.addLike(whosLogin, args._id)
            return result
        },
    }
}

module.exports = resolvers