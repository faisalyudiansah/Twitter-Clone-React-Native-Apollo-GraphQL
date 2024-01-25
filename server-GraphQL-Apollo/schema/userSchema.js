const typeDefs = `#graphql
    type Message {
        message: String
    }

    type User {
        _id: ID
        name: String
        username: String!
        email: String!
        profileImg: String
    }

    type LoginResponse {
        access_token: String!
    }

    input RegisterUser {
        name: String
        username: String!
        email: String!
        password: String!
        profileImg: String
    }

    input LoginUser {
        username: String!
        password: String!
    }

    input UpdateProfileImg {
        _id: ID!
        profileImg: String
    }

    type Query {
        getUsers: [User]
        getUserById(_id: ID!): User
        getUserByUsername(username: String!): User
        getUserByName(name: String!): User
    }

    type Mutation {
        register(RegisterUser: RegisterUser): User
        login(LoginUser: LoginUser): LoginResponse
        deleteUserById(_id: ID!): Message
        updateProfileImg(UpdateProfileImg: UpdateProfileImg): Message
    }
`;

module.exports = typeDefs