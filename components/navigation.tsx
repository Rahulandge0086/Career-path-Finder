"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { LogOut, BarChart3, UserCircle } from "lucide-react"
import { useEffect, useState, useRef } from "react"

export function Navigation() {
  const { user, signOut, signIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = async () => {
    if (!user) {
      await signIn()
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 pointer-events-auto ${isScrolled ? "glass border-b border-white/20" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <div className="w-15 h-10 bg-none flex items-center justify-center transition-all duration-300">
              <img src="/images/logo.png" className="w-20 h-20"/>
            </div>
            <span className="text-2xl font-bold">CareerPath</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
                  >
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
                  >
                    Profile
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/assessment"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
                  >
                    Assessment
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
                <div className="relative" ref={menuRef}>
                  {/* Trigger Button */}
                  <button
                    onClick={() => setOpen(!open)}
                    className="h-10 w-10 rounded-full bg-gray-800 text-white font-bold hover:scale-105 transition-transform duration-300"
                  >
                    P
                  </button>

                  {/* Dropdown Menu */}
                  {open && (
                    <div className="absolute right-0 mt-2 w-64 rounded-sm bg-gray-900 text-white border border-white/20 shadow-lg overflow-hidden">
                      <div className="flex items-center gap-3 p-3 border-b border-b-white/30">
                        <div className="flex flex-col leading-none">
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="truncate w-[180px] text-xs text-gray-300">{user.email}</p>
                        </div>
                      </div>

                      <div className="border-t border-white/10" />
                      <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center px-3 py-2 transition-colors duration-200 border-b border-b-white/30 hover:bg-gray-600/50"
                      >
                        <UserCircle className="mr-3 h-4 w-4" />
                        Home
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center px-3 py-2 transition-colors duration-200 border-b border-b-white/30 hover:bg-gray-600/50"
                      >
                        <UserCircle className="mr-3 h-4 w-4" />
                        Profile
                      </Link>

                      <Link
                        href="/assessment"
                        onClick={() => setOpen(false)}
                        className="flex items-center px-3 py-2 transition-colors duration-200 border-b border-b-white/30 hover:bg-gray-600/50"
                      >
                        <BarChart3 className="mr-3 h-4 w-4" />
                        Assessment
                      </Link>

                      <div className="border-t border-white/10" />

                      <button
                        onClick={signOut}
                        className="flex items-center w-full px-3 py-2 text-white hover:bg-red-500/40 transition-colors duration-200"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button
                onClick={handleGetStarted}
                variant="outline"
                size="sm"
                className="text-white border-white/20 rounded-[5px] bg-black hover:bg-gray-500/20 hover:text-black transition-all duration-300 cursor-pointer"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
