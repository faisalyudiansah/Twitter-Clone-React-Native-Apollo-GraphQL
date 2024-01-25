import { gql } from '@apollo/client'

export const FOLLOW_ANOTHER_USER = gql`
    mutation FollowAnotherUser($id: ID!) {
        followAnotherUser(_id: $id) {
        message
        }
    }
`