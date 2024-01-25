import { gql } from '@apollo/client'

export const SEARCH_USERNAME = gql`
    query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
        _id
        name
        username
        email
        profileImg
    }
    }
`