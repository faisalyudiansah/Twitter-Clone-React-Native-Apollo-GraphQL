import { gql } from '@apollo/client'

export const ADD_LIKE = gql`
mutation AddLike($id: ID!) {
    addLike(_id: $id) {
      username
      postId
      createdAt
      updatedAt
    }
  }
`