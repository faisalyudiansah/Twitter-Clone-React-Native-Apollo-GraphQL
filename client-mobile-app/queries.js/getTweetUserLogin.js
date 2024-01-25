import { gql } from '@apollo/client'

export const GET_TWEET_USER_LOGIN = gql`
query Query {
  getPostUserLogin {
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