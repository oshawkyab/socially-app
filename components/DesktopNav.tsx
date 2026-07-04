import Link from 'next/link'
// shadcnUI
import { Button } from './ui/button'
// clerk
import { SignInButton } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
// icons
import { Bell, HomeIcon, UserRound } from 'lucide-react'
// components
import ModeToggle from './ModeToggle'

// nav links item
const navLinks = [
   { title: "Home", href: "/", icon: <HomeIcon /> },
   { title: "notification", href: "/notifications", icon: <Bell /> },
]

const DesktopNav = async () => {
   // get user from clerk
   const user = await currentUser()

   return (
      <div className='hidden lg:flex space-x-7 items-center'>

         <ModeToggle />

         {user ? (
            <>
               {navLinks.map((link, idx) => (
        
                     <Link href={link.href} key={idx}>
                        <Button className='flex items-center gap-2 text-sm font-medium' variant={"ghost"}>
                           {link.icon}
                           {link.title}
                        </Button>
                     </Link>

               ))}
               <Link href={`/profile/${user?.primaryEmailAddress?.emailAddress.split("@")[0]}`}>
                  <Button className='flex items-center gap-2 text-sm font-medium' variant={"ghost"}>
                     <UserRound />
                     Profile
                  </Button>
               </Link>
               <UserButton />
            </>
         ) : (
            <SignInButton mode="modal">
               <Button className='font-semibold' variant={"outline"}>
                  SignIn
               </Button>
            </SignInButton>
         )}

      </div>
   )
}

export default DesktopNav