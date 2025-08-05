"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === "dark"

  return (
<button
  aria-label="Toggle theme"
  onClick={() => setTheme(isDark ? "light" : "dark")}
  className={`
    relative rounded-full flex items-center transition-colors duration-300
    bg-slate-300 dark:bg-purple-600
    
    shadow
    border border-gray-400 dark:border-purple-700
     ml-3
    w-12 h-7       /* Mobile size */
    md:w-20 md:h-10 /* Desktop and up */
  `}
>
  <span
    className={`
      block  rounded-full bg-white transition-transform duration-300
      h-6 w-6           /* Mobile thumb size */
      md:h-8 md:w-8     /* Desktop thumb size */
      transform
      ${isDark ? "translate-x-5 md:translate-x-10" : "translate-x-1"}
      flex items-center justify-center
      text-xs
    `}
  >
    {isDark
      ? <Moon className="text-purple-600 w-4 h-4 md:w-5 md:h-5" />
      : <Sun className="text-yellow-500 w-4 h-4 md:w-5 md:h-5" />
    }
  </span>
</button>
  )
}
