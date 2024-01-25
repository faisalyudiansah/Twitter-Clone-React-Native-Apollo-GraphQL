if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
// typeDefs
const userTypeDefs = require('./schema/userSchema')
const followTypeDefs = require('./schema/followSchema')
const postTypeDefs = require('./schema/postSchema')

// resolvers
const userResolver = require('./resolvers/userResolver')
const followResolver = require('./resolvers/followResolver')
const postResolver = require('./resolvers/postResolver')

const { connect } = require('./config/mongodb')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const server = new ApolloServer({
    typeDefs: [userTypeDefs, followTypeDefs, postTypeDefs],
    resolvers: [userResolver, followResolver, postResolver],
    introspection: true
})

connect()
    .then(database => {
        console.log("connect to mongodb atlas")
        return startStandaloneServer(server, {
            context: async ({ req, res }) => {
                return {
                    auth: () => {
                        let access_token = req.headers.authorization
                        if (!access_token) {
                            throw new Error('invalid token')
                        }
                        let splitedToken = access_token.split(' ')[1]
                        let decodedToken = jwt.verify(splitedToken, JWT_SECRET)
                        return decodedToken
                    }
                }
            },
            listen: { port: process.env.PORT || 3000 },
        })
    })
    .then(({ url }) => {
        console.log(`🚀 Server ready at: ${url}`)
    })
    .catch(err => console.log(err))