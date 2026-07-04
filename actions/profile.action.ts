"use server"
import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.action";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserProfileByUsername(username: string) {
   try {
      const user = await prisma.user.findUnique({
         where: {
            username
         },
         include: {
            _count: {
               select: {
                  followers: true,
                  following: true,
                  posts: true
               }
            },
         }
      })

      if (!user) throw new Error("User not found");
      return user;
   } catch (error) {
      console.log(error)
      throw new Error("Failed to fetch user profile");
   }
}

export async function getUserPosts(userId: string) {
   try {
      return prisma.post.findMany({
         where: {
            authorId: userId
         },
         include: {
            user: {
               select: {
                  id: true,
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

   } catch (error) {
      console.log(error)
      throw new Error("faild to fetch user's posts")
   }
}
export async function getUserPostsLiked(userId: string) {
   try {
      return prisma.post.findMany({
         where: {
            likes: {
               some: {
                  authorId: userId
               }
            }
         },
         include: {
            user: {
               select: {
                  id: true,
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

   } catch (error) {
      console.log(error)
      throw new Error("faild to fetch user's posts")
   }
}

export async function userIsFollowing(userId: string) {
   try {
      const currentUserId = await getUserId()

      if (!currentUserId) return false

      const isFollowing = await prisma.follows.findUnique({
         where: {
            followerId_followingId: {
               followerId: currentUserId,
               followingId: userId
            }
         }
      })

      return !!isFollowing

   } catch (error) {
      console.log(error)
      throw new Error("Somthing went wrong while try to follow user")
   }
}

export async function updateProfile(formData: FormData) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;

    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        name,
        bio,
        location,
        website,
      },
    });

    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
