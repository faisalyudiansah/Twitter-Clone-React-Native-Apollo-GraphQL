import { gql } from '@apollo/client'

export const REGISTER_USER = gql`
mutation Mutation($registerUser: RegisterUser) {
  register(RegisterUser: $registerUser) {
    _id
    name
    username
    email
    profileImg
  }
}
`