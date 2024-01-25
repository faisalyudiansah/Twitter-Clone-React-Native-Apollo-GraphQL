import { gql } from '@apollo/client'

export const GET_TWEET_BY_ID = gql`
query GetPostById($id: ID!) {
    getPostById(_id: $id) {
      _id
      content
      tags
      imgUrl
      authorId
      authorInfo {
        _id
        name
        username
        email
        profileImg
      }
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