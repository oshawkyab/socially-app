"use server"

import { prisma } from "@/lib/prisma"
import { getUserId } from "./user.action"
import { revalidatePath } from "next/cache"

const createPost = async (content: string, imageUrl: string) => {
   const userId = await getUserId() as string

   if (!userId) return { success: false, message: "Unauthorized" }

   try {

      const post = await prisma.post.create({
         data: {
            content,
            image: imageUrl,
            authorId: userId
         }
      })

      revalidatePath("/")


      return { success: true, message: "Post has created successfully", post }

   } catch (error) {
      console.log(error)
      return { success: false, message: "post doesn't created" }
   }
}

const getPosts = async () => {

   try {
      const posts = await prisma.post.findMany({
         include: {
            user: {
               select: {
                  id:true,
                  username: true,
                  email: true,
                  clerkId: true,
                  image: true
               },

            },
            comments: {
               include: {
                  user: {
                     select: {
                        id: true,
                        name: true,
                        image: true,
                        username: true,
                        email: true
                     }
                  }
               },
               orderBy: {
                  createdAt: "desc"
               }
            },
            likes: {
               select: {
                  authorId: true,
               },
            },
            _count: {
               select: {
                  comments: true,
                  likes: true
               }
            }
         },
         orderBy: {
            createdAt: "desc"
         },


      })
      return posts
   } catch (error) {
      console.log(error)
      return []
   }

}

const toggleLike = async (postId: string) => {
   const userId = await getUserId()
   if (!userId) return;

   try {

      // check like existing or not
      const existingLike = await prisma.like.findUnique({
         where: {
            authorId_postId: {
               authorId: userId,
               postId
            }
         }
      })

      // check post is existing and take authorId
      const post = await prisma.post.findUnique({
         where: {
            id: postId
         },
         select: {
            authorId: true
         }
      })
      if (!post) throw new Error("Post is not defined");

      if (existingLike) {
         // unLike
         await prisma.like.delete({
            where: {
               authorId_postId: {
                  authorId: userId,
                  postId
               }
            }
         })
         return { success: true, message: "Unlike successfully" }
      } else {
         // like
         await prisma.$transaction(async (tx) => {

            // create a like
            const like = await tx.like.create({
               data: {
                  authorId: userId,
                  postId
               }
            })

            // post validation
            if (!post) throw new Error("Post is not defined")

            // if user not has this post
            if (post.authorId !== userId) {
               await prisma.notification.create({
                  data: {
                     type: "LIKE",
                     userId: post.authorId,
                     creatorId: userId,
                     postId
                  }
               })
            }

            revalidatePath("/")

            return { success: true, message: "Liked successfully" };

         })
      }


   } catch (error) {
      console.log(error)
      return { success: false, message: "Something error in server action for handle toggleLike" }
   }
}

const addComment = async (postId: string, content: string) => {
   try {
      const userId = await getUserId()
      if (!userId) return;

      // post is existing
      const post = await prisma.post.findUnique({
         where: { id: postId },
         select: { authorId: true }
      })
      if (!post) throw new Error("post is not defined")

      return await prisma.$transaction(async () => {
         // create a new comment
         const newComment = await prisma.comment.create({
            data: {
               content,
               postId,
               authorId: userId
            },
            include: {
               user: {
                  select: {
                     id: true,
                     username: true,
                     email: true,
                     image: true
                  }
               }
            }
         })

         // handle part of notification
         if (post.authorId !== userId) {
            await prisma.notification.create({
               data: {
                  type: "COMMENT",
                  creatorId: userId,
                  userId: post.authorId,
                  commentId: newComment.id,
                  postId: newComment.postId
               }
            })
         }
         revalidatePath("/")
         return { success: true, newComment, message: "You Commented successfully" }
      })

   } catch (error) {
      console.log("error in action server add comment side => ", error)
   }
}

const deletePost = async (postId: string) => {
   try {
      const userId = await getUserId()
      if (!userId) return

      const post = await prisma.post.findUnique({ where: { id: postId } })
      if (!post) throw new Error("post is not found");

      await prisma.post.delete({ where: { id: postId } })

      revalidatePath("/")

      return { success: true, message: "post has been deleted successfully" }

   } catch (error) {
      console.log(error)
      throw new Error("error while trying to delete a post");
   }
}


export { createPost, getPosts, toggleLike, addComment, deletePost }