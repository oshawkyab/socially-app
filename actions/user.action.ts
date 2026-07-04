"use server"

import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

const syncUser = async () => {
   try {

      // get some userId and user info from clerk
      const { userId } = await auth()
      const user = await currentUser()

      // if we don't have user 
      if (!userId || !user) return

      // check user in db or that's first
      const existingUser = await prisma.user.findUnique({
         where: { clerkId: userId }
      })
      if (existingUser) return existingUser

      // new user so push in db
      const newUser = await prisma.user.create({
         data: {
            clerkId: userId,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName || ""} ${user.lastName || ""}`,
            username: user.emailAddresses[0].emailAddress.split("@")[0],
            image: user.imageUrl
         }
      })

      return newUser

   } catch (error) {
      console.log("error in sync user function ", error)
      return error
   }
}

const getUserByClerkId = async (clerkId: string) => {
   return prisma.user.findUnique({
      where: { clerkId },
      include: {
         _count: {
            select: {
               followers: true,
               following: true,
               posts: true
            }
         }
      }
   })
}

// get user id 
const getUserId = async () => {
   const { userId: clerkId } = await auth()

   if (!clerkId) return

   const user = await getUserByClerkId(clerkId)
   // if we can't reach the user
   if (!user) return null

   return user.id
}

const getRandomUsers = async () => {

   const userId = await getUserId() as string

   if (!userId) return { success: false, message: "Unauthorized" }

   try {
      // take 3 users exclude me && users i followed
      const randomUsers = await prisma.user.findMany({
         where: {
            AND: [
               { NOT: { id: userId } },
               {
                  NOT: {
                     followers: {
                        some: {
                           followerId: userId
                        }
                     }
                  }
               }
            ]
         },
         select: {
            id: true,
            username: true,
            image: true,
            email: true,
            followers: true
         }
      })

      return { success: true, randomUsers };
   } catch (error) {
      console.log(error)
      return { success: false, message: error }
   }
}

const toggleFollow = async (targetUserId: string) => {
   try {

      // get my user id
      const userId = await getUserId()

      if (!userId) return { success: false, message: "Unauthorized" }

      // user try to follow himself
      if (userId === targetUserId) return { success: false, message: "You can't follow yourself" }

      const existingFollow = await prisma.follows.findUnique({
         where: {
            followerId_followingId: {
               followerId: userId as string,
               followingId: targetUserId
            }
         }
      })

      if (existingFollow) {

         // unfollow
         const data = await prisma.follows.delete({
            where: {
               followerId_followingId: {
                  followerId: userId as string,
                  followingId: targetUserId
               }
            }
         })

         revalidatePath("/")

         return { message: "Unfollow successfully", success: true, data }
      } else {


         // follow
         const data = await prisma.$transaction([
            prisma.follows.create({ data: { followerId: userId as string, followingId: targetUserId } }),
            prisma.notification.create({ data: { type: "FOLLOW", userId: targetUserId, creatorId: userId as string } })
         ])

         revalidatePath("/")

         return { success: true, message: "you followed user successfully", data }

      }


   } catch (error) {
      console.log(error)
      return { success: false, message: "Error from toggleFollow function" }
   }
}


export { getUserId, getUserByClerkId, syncUser, getRandomUsers, toggleFollow }