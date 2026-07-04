import { currentUser } from "@clerk/nextjs/server"
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { SignInButton } from "@clerk/nextjs"
import { getUserByClerkId } from "@/actions/user.action"
import Link from "next/link"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { LinkIcon, MapPinIcon } from "lucide-react"

const Sidebar = async () => {
   const userAuth = await currentUser()
   if (!userAuth) return <UnAuthonticationCard />
   
   const user = await getUserByClerkId(userAuth.id)

   if(!user) return null

      return (
    <div className="sticky top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user?.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2 ">
                <AvatarImage src={user?.image || "/avatar.png"} />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </Link>

            {user.bio && <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>}

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{user._count.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">{user._count.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {user.location || "No location"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                {user.website ? (
                  <a href={`${user.website}`} className="hover:underline truncate" target="_blank">
                    {user.website}
                  </a>
                ) : (
                  "No website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
   )
}

export default Sidebar

const UnAuthonticationCard = () => {
   return (
      <Card className="sticky top-20">
         <CardHeader>
            <CardTitle className="font-semibold mb-2">Login to your account</CardTitle>
            <CardDescription>
               Enter your email below to login to your account
            </CardDescription>
         </CardHeader>

         <CardContent className="flex items-center space-y-4 flex-col mt-5">

            <SignInButton mode="modal">
               <Button variant={"default"} className="w-full cursor-pointer font-semibold">
                  SignIn
               </Button>
            </SignInButton>

            <SignInButton mode="modal">
               <Button className="w-full cursor-pointer font-medium" variant={"outline"}>
                  SignUp
               </Button>
            </SignInButton>

         </CardContent>

      </Card>
   )
}