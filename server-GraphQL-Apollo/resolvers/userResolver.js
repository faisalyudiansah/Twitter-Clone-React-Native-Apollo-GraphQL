const User = require("../models/user")
const validator = require('validator')

const resolvers = {
    Query: {
        getUsers: async (parent, args, contextValue, info) => {
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let dataUsers = await User.getAllUser()
            return dataUsers
        },
        getUserById: async (parent, args, contextValue, info) => {
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let findUser = await User.getUserById(args._id)
            return findUser
        },
        getUserByUsername: async (parent, args, contextValue, info) => {
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let findUser = await User.getUserByUsername(args.username)
            return findUser
        },
        getUserByName: async (parent, args, contextValue, info) => {
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let findUser = await User.getUserByName(args.name)
            return findUser
        },
    },
    Mutation: {
        register: async (parent, args, contextValue, info) => {
            let requiredUsername = validator.isEmpty(args.RegisterUser.username)
            if(requiredUsername){
                throw new Error("Username is required")
            }
            let requiredEmail = validator.isEmpty(args.RegisterUser.email)
            if(requiredEmail){
                throw new Error("E-mail is required")
            }
            let requiredPassword = validator.isEmpty(args.RegisterUser.password)
            if(requiredPassword){
                throw new Error("Password is required")
            }

            let newUser = {
                name: args.RegisterUser.name,
                username: args.RegisterUser.username,
                email: args.RegisterUser.email,
                password: args.RegisterUser.password,
                profileImg: args.RegisterUser.profileImg,
            }
            let checkEmailFormat = validator.isEmail(newUser.email)
            if(!checkEmailFormat){
                throw new Error("Invalid e-mail format")
            }
            let checkLengthPassword = validator.isLength(newUser.password, { min: 5, max: undefined })
            if(!checkLengthPassword){
                throw new Error("The minimum password length is 5 characters")
            }
            await User.register(newUser)
            return newUser
        },
        login: async (parent, args, contextValue, info) => {
            let requiredUsername = validator.isEmpty(args.LoginUser.username)
            if(requiredUsername){
                throw new Error("Username is required")
            }
            let requiredPassword = validator.isEmpty(args.LoginUser.password)
            if(requiredPassword){
                throw new Error("Password is required")
            }
            let loginUser = {
                username: args.LoginUser.username,
                password: args.LoginUser.password,
            }
            let resultLogin = await User.login(loginUser)
            return resultLogin
        },
        deleteUserById: async (parent, args, contextValue, info) => {
            let requiredIdUser = validator.isEmpty(args._id)
            if(requiredIdUser){
                throw new Error("Id user is required")
            }
            let deleted = await User.deleteUser(args._id)
            return deleted
        },
        updateProfileImg: async(parent, args, contextValue, info) => {
            let requiredIdUser = validator.isEmpty(args.UpdateProfileImg._id)
            if(requiredIdUser){
                throw new Error("Id user is required")
            }
            let requiredProfileImg = validator.isEmpty(args.UpdateProfileImg.profileImg)
            if(requiredProfileImg){
                throw new Error("Profile image url is required")
            }
            let whosLogin = contextValue.auth()
            if (!whosLogin) {
                throw new Error('Authorization failed')
            }
            let updated = await User.updateProfileImg(args.UpdateProfileImg._id, args.UpdateProfileImg.profileImg)
            return updated
        }
    }
}

module.exports = resolvers