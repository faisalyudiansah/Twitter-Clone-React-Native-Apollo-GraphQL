import { gql } from '@apollo/client'

export const PROFILE_AND_FOLLOW = gql`
query ProfileAndFollowUserLogin {
    profileAndFollowUserLogin {
      idUserLogin
      nameUserLogin
      usernameUserLogin
      emailUserLogin
      profileImgUserLogin
      following {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        userInfo {
          _id
          name
          username
          email
          profileImg
        }
      }
      follower {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        userInfo {
          _id
          name
          username
          email
          profileImg
        }
      }
      
    }
  }
`