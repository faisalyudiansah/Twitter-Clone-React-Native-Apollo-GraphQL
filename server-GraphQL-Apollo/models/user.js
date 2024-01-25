const { getDb } = require('../config/mongodb')
const { ObjectId } = require('mongodb');
const redis = require('../config/redis');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
class User {
    static getCollection() {
        return getDb().collection("users")
    }

    static async getAllUser() {
        let userCache = await redis.get("get:allusers")
        if (userCache) {
            let users = await JSON.parse(userCache)
            return users
        } else {
            const agg = [
                {
                    '$project': {
                        'password': 0
                    }
                }
            ]
            let users = await this.getCollection().aggregate(agg).toArray()
            await redis.set("get:allusers", JSON.stringify(users))
            return users
        }
    }

    static async getUserById(id) {
        let findUser = await this.getCollection().findOne({
            _id: new ObjectId(id)
        })
        if (!findUser) {
            throw new Error(`Cannot find an user`)
        }
        return findUser
    }

    static async getUserByUsername(username) {
        let findUser = await this.getCollection().findOne({
            username: { $regex: new RegExp(username, 'i') }
        })
        if (!findUser) {
            throw new Error(`Cannot find an user`)
        }
        return findUser
    }

    static async getUserByName(name) {
        let findUser = await this.getCollection().findOne({
            name: { $regex: new RegExp(name, 'i') }
        })
        if (!findUser) {
            throw new Error(`Cannot find an user`)
        }
        return findUser
    }

    static async register(user) {
        let checkUsername = await this.getCollection().findOne({
            username: user.username
        })
        if (checkUsername) {
            throw new Error("Username already exists")
        }
        let checkEmail = await this.getCollection().findOne({
            email: user.email
        })
        if (checkEmail) {
            throw new Error("E-mail already exists")
        }
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
        let newUser = await this.getCollection().insertOne(user)
        await redis.del("get:allusers")
        return newUser
    }

    static async login(loginUser) {
        let findUser = await this.getCollection().findOne({
            username: loginUser.username
        })
        if (!findUser) {
            throw new Error(`Invalid username/password`)
        }
        let checkPassword = bcrypt.compareSync(loginUser.password, findUser.password)
        if (!checkPassword) {
            throw new Error(`Invalid username/password`)
        }
        let access_token = jwt.sign({
            idLogin: findUser._id,
            nameLogin: findUser.name,
            usernameLogin: findUser.username,
            emailLogin: findUser.email,
            profileImgLogin: findUser.profileImg,
        }, JWT_SECRET)
        return { access_token }
    }

    static async deleteUser(id) {
        let findUser = await this.getUserById(id)
        if (!findUser) {
            throw new Error(`Cannot find an user`)
        }
        await this.getCollection().deleteOne(
            {
                _id: findUser._id
            }
        )
        await redis.del("get:allusers")
        return { message: "Deleted successfully" }
    }

    static async updateProfileImg(id, profileImgUrl) {
        await this.getCollection().updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    profileImg: profileImgUrl
                }
            }
        )
        await redis.del("get:allPosts")
        await redis.del("get:allusers")
        await redis.del("get:postUserLogin")
        await redis.flushall()
        return { message: 'Profile image has been updated' }
    }
}

module.exports = User