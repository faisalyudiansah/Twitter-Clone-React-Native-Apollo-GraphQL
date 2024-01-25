import { gql } from '@apollo/client'

export const SEARCH_NAME = gql`
    query GetUserByUsername($name: String!) {
  getUserByName(name: $name) {
    _id
    name
    username
    email
    profileImg
  }
}
`