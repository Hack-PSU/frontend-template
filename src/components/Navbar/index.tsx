"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useFirebase } from "@/lib/providers/FirebaseProvider"
import HomeIcon from "@mui/icons-material/Home"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"

// Desktop NavbarButton Component (with button images)
interface NavbarButtonProps {
  href: string
  text: string
  isExternal?: boolean
  onClick?: () => void
}

function NavbarButton({ href, text, isExternal = false, onClick }: NavbarButtonProps) {
  const content = (
    <div className="relative w-32 h-18 md:w-36 md:h-20 lg:w-40 lg:h-22 transition-all duration-200 ease-out hover:scale-105 active:scale-95 hover:brightness-110 hover:drop-shadow-lg">
      <Image
        src="/Navbar.svg"
        alt={`${text} navigation button`}
        fill
        className="object-contain drop-shadow-sm"
        priority
      />
      <span className="absolute inset-0 flex items-center justify-center font-rye font-semibold text-black text-[9px] md:text-[10px] lg:text-[11px] tracking-wider drop-shadow-sm">
        {text.toUpperCase()}
      </span>
    </div>
  )

  const className = "block focus:outline-none focus:ring-2 focus:ring-customYellow focus:ring-opacity-50 rounded-lg"

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
        aria-label={`Navigate to ${text} (opens in new tab)`}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} onClick={onClick} className={className} aria-label={`Navigate to ${text}`}>
      {content}
    </Link>
  )
}

// Mobile Menu Item Component (standard styling with golden theme)
interface MobileMenuItemProps {
  href: string
  text: string
  isExternal?: boolean
  onClick?: () => void
}

function MobileMenuItem({ href, text, isExternal = false, onClick }: MobileMenuItemProps) {
  const className = `
    block w-full px-6 py-4 text-lg font-rye font-semibold text-black bg-customYellow 
    rounded-lg border-2 border-yellow-600 shadow-lg
    hover:bg-yellow-300 hover:border-yellow-700 hover:shadow-xl
    active:bg-yellow-400 active:scale-98
    focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50
    transition-all duration-200 ease-out
    text-center tracking-wide
  `

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
        aria-label={`Navigate to ${text} (opens in new tab)`}
      >
        {text.toUpperCase()}
      </a>
    )
  }

  return (
    <Link href={href} onClick={onClick} className={className} aria-label={`Navigate to ${text}`}>
      {text.toUpperCase()}
    </Link>
  )
}

// MLH Badge Component (desktop only)
function MLHBadge() {
  return (
    <a
      id="mlh-trust-badge"
      className="mlh-badge block transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-customYellow focus:ring-opacity-50 rounded-lg"
      href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Major League Hacking 2026 Hackathon Season"
    >
      <Image
        src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-white.svg"
        alt="Major League Hacking 2026 Hackathon Season"
        width={100}
        height={100}
        className="w-16 h-16 lg:w-40 lg:h-40 drop-shadow-lg"
      />
    </a>
  )
}

// Main Navbar Component
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { isAuthenticated, isLoading } = useFirebase()
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === "/"

  // Enhanced menu toggle with animation state
  const toggleMenu = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setMenuOpen(!menuOpen)

    setTimeout(() => setIsAnimating(false), 300)
  }

  // Close mobile menu on route change
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }, [pathname])

  // Enhanced escape key and body scroll handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        toggleMenu()
      }
    }

    if (menuOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const getNavItems = () => {
    const baseItems = [
      { href: isHome ? "#faq" : "/#faq", text: "info" },
      { href: isHome ? "#schedule" : "/#schedule", text: "schedule" },
      { href: isHome ? "#prizes" : "/#prizes", text: "prizes" },
      { href: isHome ? "#sponsors" : "/#sponsors", text: "sponsors" },
      { href: isHome ? "#workshops" : "/#workshops", text: "workshops" },
    ]

    const authItem =
      !isLoading && isAuthenticated ? { href: "/profile", text: "profile" } : { href: "/signin", text: "register" }

    return [...baseItems, authItem]
  }

  const navItems = getNavItems()
  const leftItems = navItems.slice(0, 3)
  const rightItems = navItems.slice(3)

  return (
    <>
      <nav className="sticky top-0 w-full bg-customRed border-b-4 border-customYellow z-50 shadow-lg">
        {/* Mobile Navbar */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 sm:px-6">
          <button
            onClick={() => router.push("/")}
            className="text-white hover:text-customYellow transition-all duration-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-customYellow focus:ring-opacity-50"
            aria-label="Go to homepage"
          >
            <HomeIcon fontSize="large" />
          </button>

          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="w-16 h-16 drop-shadow-lg"
            />
          </Link>

          <button
            onClick={toggleMenu}
            disabled={isAnimating}
            className="text-white hover:text-customYellow transition-all duration-200 p-2 rounded-lg  hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-customYellow focus:ring-opacity-50 disabled:opacity-50"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            <div className="relative w-6 h-6">
              <MenuIcon
                fontSize="large"
                className={`absolute transition-all duration-300 ${menuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"}`}
              />
              <CloseIcon
                fontSize="large"
                className={`absolute transition-all duration-300 ${menuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"}`}
              />
            </div>
          </button>
        </div>

        {/* Desktop Navbar - Smaller Size */}
        <div className="hidden lg:flex items-center justify-center relative h-16 px-4 xl:px-8">
          {/* Left Navigation Items */}
          <div className="flex items-center space-x-1 xl:space-x-2">
            {leftItems.map((item, index) => (
              <NavbarButton key={index} href={item.href} text={item.text} />
            ))}
          </div>

          {/* Logo */}
          <Link href="/" className="mx-6 xl:mx-8 group">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="w-16 h-16 xl:w-20 xl:h-20 drop-shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-2xl"
              priority
            />
          </Link>

          {/* Right Navigation Items */}
          <div className="flex items-center space-x-1 xl:space-x-2">
            {rightItems.map((item, index) => (
              <NavbarButton key={index + leftItems.length} href={item.href} text={item.text} />
            ))}
          </div>

          {/* MLH Badge - Desktop Only */}
          <div className="absolute right-4 xl:right-8 top-[0px] hidden xl:block">
            <MLHBadge />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-out ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            menuOpen ? "bg-opacity-60" : "bg-opacity-0"
          }`}
          onClick={toggleMenu}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-16 left-0 right-0 bottom-0 bg-customRed border-t-4 border-customYellow transform transition-transform duration-300 ease-out overflow-y-auto ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex flex-col space-y-4 p-6 pb-12">
            {/* Mobile Navigation Items - No MLH Badge */}
            {navItems.map((item, index) => (
              <div
                key={index}
                className={`transform transition-all duration-300 ease-out ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <MobileMenuItem href={item.href} text={item.text} onClick={toggleMenu} />
              </div>
            ))}

            {/* Close instruction */}
            <p
              className={`text-customYellow text-sm text-center mt-6 opacity-75 transform transition-all duration-300 ease-out ${
                menuOpen ? "translate-y-0 opacity-75" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${navItems.length * 50}ms` }}
            >
              Tap outside or press ESC to close
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
