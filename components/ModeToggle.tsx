"use client"

import { useTheme } from "next-themes"
import { Button } from "./ui/button"

// icons
import { MoonIcon, SunIcon } from "lucide-react"

const ModeToggle = () => {
   const { theme, setTheme } = useTheme()
   // handle toggle mode
   const toggleMode = () => {
      setTheme(theme === "dark" ? "light" : "dark")
   }

   return (
      <Button onClick={toggleMode} variant={"outline"} className="cursor-pointer">
         <SunIcon className="w-3 h-3 dark:rotate-0 -rotate-90 scale-0 dark:scale-100 hidden dark:block" />
         <MoonIcon className="w-3 h-3 dark:-rotate-90 rotate-0 scale-100 dark:scale-0 block dark:hidden" />
      </Button>
   )
}

export default ModeToggle