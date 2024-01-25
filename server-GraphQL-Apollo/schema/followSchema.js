const typeDefs = `#graphql
    type FollowAnotherUserResponse {
        message: String
    }

    type User {
        _id: ID
        name: String
        username: String!
        email: String!
        profileImg: String
    }

    type Follow {
        _id: ID
        followingId: String
        followerId: String
        createdAt: String
        updatedAt: String
        userInfo: User
    }

    type ProfileWithFollowInfo {
        idUserLogin: ID
        nameUserLogin: String
        usernameUserLogin: String!
        emailUserLogin: String!
        profileImgUserLogin: String
        following: [Follow]
        follower: [Follow]
    }

    type Query {
       profileAndFollowUserLogin: ProfileWithFollowInfo
    }

    type Mutation {
        followAnotherUser(_id: ID!): FollowAnotherUserResponse
    }
`;

module.exports = typeDefs