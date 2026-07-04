import { getRandomUsers, getUserId } from "@/actions/user.action"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"
import FollowButton from "./FollowButton"
import { Separator } from "./ui/separator"

const RandomUsers = async () => {

   const userId = await getUserId()

   if(!userId) {
      return null
   }

   const { randomUsers } = await getRandomUsers()

   if(randomUsers && randomUsers?.length > 0) return (
      <Card>

         <CardHeader>
            <CardTitle>
               Suggestion Users
            </CardTitle>
         </CardHeader>

         <Separator />

         <CardContent className="space-y-5">
            {randomUsers?.map((user) => {
               return (
                  <div className="flex justify-between items-center" key={user.id}>
                     {/* left side */}
                     <div className="flex space-x-2 items-start">

                        <Avatar style={{width: "45px", height: "45px", borderRadius: "50%"}}>
                           <AvatarImage
                              src={user.image || "/images/unknown.png"}
                              alt="profile-image"
                              className="w-full border-white border rounded-rounded h-full"
                           />
                        </Avatar>

                        <div className="">
                           <h3 className="tracking-wider">{user.username}</h3>
                           <p className="text-xs text-gray-400">{user.email}</p>
                           <p className="text-xs text-gray-400" >{user.followers.length} followers</p>
                        </div>

                     </div>

                     {/* right side */}
                     <FollowButton targetUserId={user.id} />

                  </div>
               )
            })}
         </CardContent>

      </Card>
   )
}

export default RandomUsers