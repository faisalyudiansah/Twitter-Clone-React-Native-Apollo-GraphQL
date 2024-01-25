import { gql } from '@apollo/client';

export const ADD_COMMENT = gql`
mutation CreateNewComment($createComment: CreateComment!) {
  createNewComment(CreateComment: $createComment) {
    content
    idUser
    name
    username
    email
    profileImg
    createdAt
    updatedAt
  }
}
`