import { gql } from '@apollo/client'

export const UPDATE_PROFILEIMAGE_URL = gql`
mutation Mutation($updateProfileImg: UpdateProfileImg) {
  updateProfileImg(UpdateProfileImg: $updateProfileImg) {
    message
  }
}
`