import Link from "next/link"
// components
import DesktopNav from "./DesktopNav"
import MobileNav from "./MobileNav"
import { currentUser } from "@clerk/nextjs/server"
import { syncUser } from "@/actions/user.action"

const Navbar = async () => {
   const user = await currentUser()
   if (user) await syncUser()
   return (
      <nav className="w-full sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 border-b">
         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

            {/* logo */}
            <Link className="text-2xl font-bold font-mono tracking-wider text-primary" href={"/"}>Socially</Link>

            {/* navLinks */}
            <DesktopNav />
            <MobileNav />

         </div>
      </nav>
   )
}

export default Navbar