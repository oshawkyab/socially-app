import { Avatar, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardHeader } from "./ui/card"
import { formatDate } from "@/utils";

const Comment = ({ content, image, username, date }: { content: string; image: string | null, username: string, date: Date }) => {

   return (
      <Card className="rounded-sm  w-full">
         {/* info user's set comment */}
         <CardHeader className="w-full flex items-center justify-between">
            <div className="w-full flex items-center space-x-2">
               <Avatar className="w-6 h-6 rounded-full border border-white">
                  <AvatarImage
                     className="w-full h-full"
                     src={image || "/images/unknown.png"}
                     alt="profile image"
                  />
               </Avatar>
               <p className="text-xs">{username}</p>
            </div>

            <p className="text-xs w-full text-end text-gray-400">{formatDate(date)}</p>

         </CardHeader>
         <CardContent>
            <p className="text-xs">{content}</p>
         </CardContent>

      </Card>
   )
}

export default Comment