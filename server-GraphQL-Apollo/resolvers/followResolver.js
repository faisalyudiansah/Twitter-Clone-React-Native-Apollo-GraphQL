const Follow = require("../models/follow")
const User = require("../models/user")

const resolvers = {
    Query: {
        profileAndFollowUserLogin: async (parent, args, contextValue, info) => {
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let findUser = await User.getUserById(whosLogin.idLogin)
            let result = await Follow.profileAndFollowUserLogin(whosLogin, findUser)
            return result
        }
    },
    Mutation: {
        followAnotherUser: async (parent, args, contextValue, info) => {
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let findUserToFollow = await User.getUserById(args._id)
            let result = await Follow.followAnotherUser(whosLogin, findUserToFollow)
            return result
        }
    }
}

module.exports = resolvers