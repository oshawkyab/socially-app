"use server"
import { prisma } from "@/lib/prisma"
import { getUserId } from "./user.action"

const getNotifications = async () => {
   try {
      const userId = await getUserId()
      if (!userId) return []

      const notifications = await prisma.notification.findMany({
         where: {
            userId
         },
         include: {
            Creator: {
               select: {
                  id: true,
                  username: true,
                  image: true,
                  name: true
               }
            },
            post: {
               select: {
                  content: true,
                  authorId: true,
                  image: true,
               }
            },
            comment: {
               select: {
                  content: true,
                  id: true
               }
            }
         },
         orderBy: { createdAt: "desc" }
      })

      if (!notifications) return []

      return notifications

   } catch (error) {
      console.log(error)
      return []
   }
}

const markNotificationsAsRead = async (notificationsIds: string[]) => {
   try {

      await prisma.notification.updateMany({
         where: { id: { in: notificationsIds } },
         data: { isRead: true }
      })

      return { success: true }

   } catch (error) {
      console.log(error)
      return { success: false }
   }
}

export { getNotifications, markNotificationsAsRead }