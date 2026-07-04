"use client"
import React, { useState } from 'react'
import ModeToggle from './ModeToggle'
// Shadcnui
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from './ui/button'
import Link from 'next/link'
import { LogIn, LogOut, TextAlignJustify } from 'lucide-react'
import { Bell, HomeIcon, UserRound } from 'lucide-react'
import { SignInButton, SignOutButton, useAuth } from '@clerk/nextjs'

const MobileNav = () => {
   const [isOpen, setIsOpen] = useState(false)
   const { isSignedIn } = useAuth()

   return (
      <div className='lg:hidden'>
         <div className='mr-4 inline'>
            <ModeToggle />
         </div>

         {/* sheet menu */}
         <Sheet onOpenChange={setIsOpen} open={isOpen}>
            <SheetTrigger asChild>
               <Button variant="outline">
                  <TextAlignJustify />
               </Button>
            </SheetTrigger>
            <SheetContent >
               <SheetHeader>
                  <SheetTitle className='text-white font-bold text-xl'>Socially</SheetTitle>
               </SheetHeader>

               <SheetDescription className='px-4 text-sm'>
                  Welcome in socially app it allows to exploring the world while you at home
               </SheetDescription>

               <div className='flex flex-col items-start space-y-7 px-4 py-3'>

                  {isSignedIn ? (
                     <>

                        <Button onClick={() => setIsOpen(false)} variant={"ghost"} asChild>
                           <Link className='flex justify-start items-center gap-4' href={"/"}>
                              <HomeIcon className='w-4 h-4' />
                              Home
                           </Link>
                        </Button>

                        <Button onClick={() => setIsOpen(false)} variant={"ghost"} asChild>
                           <Link className='flex justify-start items-center gap-4' href={"/notifications"}>
                              <Bell className='w-4 h-4' />
                              Notifications
                           </Link>
                        </Button>

                        <Button onClick={() => setIsOpen(false)} variant={"ghost"} asChild>
                           <Link className='flex justify-start items-center gap-4' href={"/profile"}>
                              <UserRound className='w-4 h-4' />
                              Profile
                           </Link>
                        </Button>

                        <SignOutButton>
                           <Button onClick={() => setIsOpen(false)} variant={"ghost"} className='flex items-center gap-4'>
                              <LogOut />
                              Sign Out
                           </Button>
                        </SignOutButton>

                     </>
                  ) : (
                     <>
                        <SignInButton mode='modal'>
                           <Button onClick={() => setIsOpen(false)} variant={"ghost"} className='flex items-center gap-4'>
                              <LogIn />
                              Sign In
                           </Button>
                        </SignInButton>
                     </>
                  )}

               </div>



            </SheetContent>
         </Sheet>


      </div>
   )
}

export default MobileNav