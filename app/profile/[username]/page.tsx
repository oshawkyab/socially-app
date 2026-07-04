import { getUserPosts, getUserPostsLiked, getUserProfileByUsername, userIsFollowing } from "@/actions/profile.action"
import ProfilePageClient from "./ProfilePageClient"
import { getUserId } from "@/actions/user.action"

const ProfilePageServer = async ({ params }: { params: Promise<{ username: string }> }) => {
   const user = await getUserProfileByUsername((await params).username)
   const userId = await getUserId() || ""
   const posts = await getUserPosts(user.id)
   const likedPosts = await getUserPostsLiked(user.id)
   const isOwnProfile = userId === user.id
   const isFollwing: boolean = await userIsFollowing(user.id)
   console.log("the result ===>> ", isFollwing)
   return (
      <ProfilePageClient
         user={user}
         userId={userId}
         posts={posts}
         likedPosts={likedPosts}
         isOwnProfile={isOwnProfile}
         initialFollowState={isFollwing}
      />
   )
}

export default ProfilePageServer