"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { LoaderCircle } from "lucide-react"
import { toggleFollow } from "@/actions/user.action"
import toast from "react-hot-toast"

const FollowButton = ({ targetUserId }: { targetUserId: string }) => {
   const [isLoading, setIsLoading] = useState(false)


   const handleFollow = async () => {
      setIsLoading(true)

      try {

         const result = await toggleFollow(targetUserId)         

         if (result.success) {
            toast.success(result.message)
         } else {
            toast.error(result.message)
         }

      } catch (error) {
         console.log(error)
         toast.error("following user failed")
      } finally {
         setIsLoading(false)
      }

   }
   return (
      <Button size={"sm"} disabled={isLoading} onClick={handleFollow} className="tracking-wider" variant={"secondary"}>{isLoading ? <LoaderCircle className="animate-spin w-4 h-4" /> : "Follow"}</Button>
   )
}

export default FollowButton