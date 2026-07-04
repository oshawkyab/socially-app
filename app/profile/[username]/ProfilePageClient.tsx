"use client"
import { updateProfile, getUserPosts, getUserProfileByUsername } from "@/actions/profile.action"
import { toggleFollow } from "@/actions/user.action"
import PostCard from "@/components/PostCard"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInButton, useUser } from "@clerk/nextjs"
import { LinkIcon, LoaderIcon, MapPinned, SquarePen } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

type User = Awaited<ReturnType<typeof getUserProfileByUsername>>
type Posts = Awaited<ReturnType<typeof getUserPosts>>
interface ProfilePageClientProps {
   user: NonNullable<User>,
   userId: string | null,
   posts: Posts,
   likedPosts: Posts,
   isOwnProfile: boolean,
   initialFollowState: boolean
}

const ProfilePageClient = ({ user, userId, posts, likedPosts, isOwnProfile, initialFollowState }: ProfilePageClientProps) => {
   const currentUser = useUser()
   const [following, setFollowing] = useState(false)
   const [showEditProfileModal, setShowEditProfileModal] = useState(false)
   const [editing, setEditing] = useState(false)
   const [data, setData] = useState({
      name: user.name ?? "",
      email: user.email,
      bio: user.bio ?? "",
      location: user.location ?? "",
      website: user.website ?? "",
   })
   const [isFollowing, setIsFollowing] = useState(initialFollowState)


   const handleEditSubmit = async () => {
      setEditing(true)
      setShowEditProfileModal(true)
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
         formData.append(key, value);
      });

      const result = await updateProfile(formData);
      setShowEditProfileModal(false)
      setEditing(false)
      if (result.success) {
         toast.success("Profile updated successfully");
      } else {
         toast.error("failed to update profile")
      }
   };


   const handleFollowOperation = async () => {
      setFollowing(true)
      try {
         setIsFollowing(!isFollowing)
         const result = await toggleFollow(user.id)
         if (result.success) {
            toast.success(result.message)
         } else {
            toast.error(result.message || "Failed to follow the user")
         }
      } catch (error) {
         console.log(error)
      } finally {
         setFollowing(false)
      }
   }

   return (
      <div className="w-full ">
         {/* info card */}
         <Card className="w-full p-3 mx-auto rounded-sm  shadow flex flex-col space-y-2">
            <Avatar className="w-24 h-24 rounded-full mx-auto">
               <AvatarImage className="w-full h-full" src={user.image ?? "/avatar.png"} />
            </Avatar>

            {/* username, bio, location, web and email */}
            <div>
               <h2 className="md:text-xl font-bold text-center">{user.username}</h2>
               <h3 className="md:text-xl text-center text-muted-foreground">{user.email}</h3>
               <div className="flex md:space-x-7 flex-col md:flex-row justify-around items-center my-4 w-full">
                  <p className="flex space-x-2 text-xs capitalize text-gray-500"><SquarePen className="w-4 h-4 mr-2 shrink-0" /> {(user.bio) ?? "not exisiting bio"}</p>
                  <p className="flex space-x-2 text-xs capitalize text-gray-500"><LinkIcon className="w-4 h-4 mr-2 shrink-0" />{user.website ?? "not existing website"}</p>
                  <p className="flex space-x-2 text-xs capitalize text-gray-500"><MapPinned className="w-4 h-4 mr-2 shrink-0" />{user.location ?? "not existing location"}</p>
               </div>

               <div className="flex flex-col md:flex-row items-center md:justify-around justify-center sm:space-y-2 md:space-x-10">
                  <div className="flex  flex-col items-center justify-center">
                     <p className="font-bold text-xs md:text-sm">{user._count.followers}</p>
                     <h2 className="text-xs md:text-sm font-semibold text-gray-400">Followers</h2>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <p className="font-bold text-xs md:text-sm">{user._count.following}</p>
                     <h2 className="text-xs md:text-sm font-semibold text-gray-400">Following</h2>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <p className="font-bold text-xs md:text-sm">{user._count.posts}</p>
                     <h2 className="text-xs md:text-sm font-semibold text-gray-400">Posts</h2>
                  </div>
               </div>
            </div>

            {!currentUser ? (
               <SignInButton mode="modal" >
                  <Button disabled variant="default" className="w-full font-monospace font-semibold">
                     Follow
                  </Button>
               </SignInButton>
            ) : !isOwnProfile ? (
               <>
                  <Button disabled={following} onClick={handleFollowOperation} className="w-full" variant={isFollowing ? "default" : "outline"}>
                     {following ? <LoaderIcon size={8} className="animate-spin" /> : isFollowing ? "Unfollow" : "Follow"}
                  </Button>
               </>
            ) : (
               <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
                  <form>
                     <DialogTrigger asChild>
                        <Button variant="default" className="w-full font-monospace font-semibold" >{editing ? <LoaderIcon size={12} className="animate-spin" /> : "Edit Profile"}</Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                           <DialogTitle>Edit profile</DialogTitle>
                           <DialogDescription>
                              Make changes to your profile here. Click save when you&apos;re
                              done.
                           </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                           <Field>
                              <Label htmlFor="name">Name</Label>
                              <Input id="name" name="name" onChange={(e) => setData({ ...data, name: e.target.value })} defaultValue={data.name} />
                           </Field>
                           <Field>
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" name="email" onChange={(e) => setData({ ...data, email: e.target.value })} defaultValue={data.email} />
                           </Field>
                           <Field>
                              <Label htmlFor="bio">Bio</Label>
                              <Input id="bio" onChange={(e) => setData({ ...data, bio: e.target.value })} name="bio" defaultValue={data.bio} />
                           </Field>
                           <Field>
                              <Label htmlFor="location">Location</Label>
                              <Input id="location" onChange={(e) => setData({ ...data, location: e.target.value })} name="location" defaultValue={data.location} />
                           </Field>
                           <Field>
                              <Label htmlFor="website">Website</Label>
                              <Input onChange={(e) => setData({ ...data, website: e.target.value })} id="website" name="website" defaultValue={data.website} />
                           </Field>

                        </FieldGroup>
                        <DialogFooter>
                           <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                           </DialogClose>
                           <Button onClick={handleEditSubmit} type="submit">Save changes</Button>
                        </DialogFooter>
                     </DialogContent>
                  </form>
               </Dialog>
            )}

         </Card>
         {/* posts likes and created by this user profile */}
         <Tabs defaultValue="posts" className="w-full p-4 mt-4 ">
            <TabsList className="mx-auto mb-10" variant="line">
               <TabsTrigger value="posts">My Posts</TabsTrigger>
               <TabsTrigger value="likes">Likes</TabsTrigger>
            </TabsList>
            <TabsContent className="flex w-full flex-col items-center gap-5" value="posts">
               {posts.length === 0 ? (
                  <p>Not exist any post</p>
               ) : (
                  posts.map((post) => (
                     <PostCard className="w-full" dbUserId={userId} post={post} key={post.id} />
                  ))
               )}
            </TabsContent>
            <TabsContent className="flex flex-col items-center gap-5" value="likes">
               {likedPosts.length === 0 ? (
                  <p>Not exist any liked post</p>
               ) : (
                  likedPosts.map((post) => (
                     <PostCard className="w-full" dbUserId={userId} post={post} key={post.id} />
                  ))
               )}
            </TabsContent>
         </Tabs>


         {/* Edit Profile Modal */}
      </div >
   )
}

export default ProfilePageClient