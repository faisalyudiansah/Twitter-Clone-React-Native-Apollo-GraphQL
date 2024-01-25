import { gql } from '@apollo/client'

export const GET_POST = gql`
  query GetAllPosts {
    getAllPosts {
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