const typeDefs = `#graphql
    type User {
        _id: ID
        name: String
        username: String!
        email: String!
        profileImg: String
    }

    type Comment {
        content: String!
        idUser: ID!
        name: String
        username: String!
        email: String!
        profileImg: String
        createdAt: String
        updatedAt: String
    }

    type Like {
        username: String!
        postId: ID!
        createdAt: String
        updatedAt: String
    }

    type Post {
        _id: ID
        content: String!
        tags: [String]
        imgUrl: String
        authorId: ID!
        authorInfo: User!
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
    }

    type CreatePostResponse {
        _id: ID
        content: String!
        tags: [String]
        imgUrl: String
        authorId: ID!
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
    }

    input CreatePost {
        content: String!
        tags: [String]
        imgUrl: String
    }

    input CreateComment {
        idPost: ID!
        content: String!
    }

    type Query {
        getAllPosts: [Post]
        getPostUserLogin: [Post]
        getPostById(_id: ID!): Post
    }

    type Mutation {
        createNewPost(CreatePost:CreatePost): CreatePostResponse
        createNewComment(CreateComment: CreateComment!): Comment
        addLike(_id: ID!): Like
    }
`;

module.exports = typeDefs