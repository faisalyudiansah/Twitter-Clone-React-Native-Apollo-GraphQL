import { gql } from '@apollo/client'

export const NEW_TWEET = gql`
    mutation CreateNewPost($createPost: CreatePost) {
        createNewPost(CreatePost: $createPost) {
        _id
        content
        tags
        imgUrl
        authorId
        comments {
            content
            idUser
            name
            username
            email
            profileImg
            createdAt
            updatedAt
        }
        likes {
            username
            postId
            createdAt
            updatedAt
        }
        createdAt
        updatedAt
        }
    }
`