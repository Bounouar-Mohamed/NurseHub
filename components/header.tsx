"use client"

import React, { useState, useEffect, useCallback, useRef, memo } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { AccountMenu } from "@/components/ui/account-menu"
import { BookAppointmentButton } from "@/components/book-appointment-button"

// ✅ Définir navItems hors composant pour éviter les recréations
const NAV_ITEMS = [
  { name: "Services", href: "#services-section" },
  { name: "Pricing", href: "#pricing-section" },
  { name: "FAQ", href: "#faq-section" },
] as const

export const Header = memo(function Header() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // ✅ Callback mémorisé pour éviter les recréations
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id)
      }
    })
  }, [])

  useEffect(() => {
    // ✅ Créer l'observer une seule fois
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0.5
    })

    const sections = NAV_ITEMS
      .map((item) => document.getElementById(item.href.substring(1)))
      .filter(Boolean)

    sections.forEach((section) => section && observerRef.current?.observe(section))
    
    return () => {
      sections.forEach((section) => section && observerRef.current?.unobserve(section))
      observerRef.current?.disconnect()
    }
  }, [handleIntersection])

  // ✅ Callback mémorisé pour la navigation
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <header className="sticky w-full flex items-center justify-center top-5 z-[9999] h-[80px] gpu-accelerated" style={{ '--header-height': '80px' } as React.CSSProperties}>
      <div className="w-[95%] bg-white/10 backdrop-blur border-[1px] border-[#000000]/10 rounded-full flex items-center">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center justify-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="160"
              height="40"
              fill="none"
              viewBox="0 0 252 63"
            >
              <path
                fill="#000"
                d="M59.766 54.268V31.065h4.98v22.617q0 2.11 2.11 3.515a5.74 5.74 0 0 0 3.105.88v4.921q-5.624 0-8.672-4.395-1.523-2.227-1.523-4.335m12.773 8.73v-4.922q3.164 0 4.629-2.52.527-.937.527-1.874V31.064h4.98v23.204q0 2.753-2.519 5.449-3.047 3.222-7.617 3.281m14.824-.293v-31.7h4.98v4.337q1.524-2.579 4.571-3.809 1.64-.645 3.223-.644h1.054l-1.171 4.804q-3.223.06-5.743 3.457-1.933 2.696-1.933 5.567v17.988zm15.879-8.32 4.629-.88q0 2.638 2.754 4.161 1.347.645 2.578.703v4.629q-5.683 0-8.496-4.101-1.465-2.169-1.465-4.512m.293-14.414q0-5.333 4.863-7.91 2.344-1.23 4.688-1.23v4.57q-2.696 0-4.16 2.226-.762 1.113-.762 2.344 0 1.875 2.93 3.047 2.226.938 8.613 2.46 3.984.82 5.684 3.926.879 1.64.879 3.692 0 5.625-4.512 8.32-2.637 1.582-6.035 1.582v-4.629q2.695 0 4.511-1.875 1.29-1.347 1.289-3.164 0-2.343-4.628-3.75-1.173-.351-3.75-.996-2.754-.644-3.985-1.055-4.453-1.758-5.39-5.332a10.2 10.2 0 0 1-.235-2.226m12.129-4.512V30.83q5.038 0 8.145 3.75 1.933 2.402 1.933 5.04l-4.629.76q0-3.223-3.515-4.51-1.055-.411-1.934-.411m14.063 18.574V39.502q.058-2.695 2.578-5.332 3.046-3.105 7.383-3.164v4.629q-2.813 0-4.395 2.46-.645 1.056-.645 1.934v3.985h13.125v-3.985q0-2.637-2.695-3.867a5.8 5.8 0 0 0-2.519-.586v-4.57q4.042 0 7.207 2.871 2.636 2.52 2.695 5.566v9.317h-17.813v5.273q0 1.641 1.875 3.047 1.524 1.055 3.223 1.055v4.57q-5.333 0-8.379-4.336-1.64-2.285-1.64-4.336m12.832 8.672v-4.629q3.515 0 5.273-3.047.351-.645.527-1.23l4.161 1.523q-1.056 4.044-4.805 6.094a10.74 10.74 0 0 1-5.156 1.29m28.711 0V21.69h5.097v17.87h5.274v4.981h-5.274v18.164zm13.3-18.164v-4.98h5.215V21.69h5.156v41.015h-5.156V44.541zm14.942 9.727V31.065h4.98v22.617q0 2.11 2.11 3.515a5.74 5.74 0 0 0 3.105.88v4.921q-5.625 0-8.672-4.395-1.523-2.227-1.523-4.335m12.773 8.73v-4.922q3.165 0 4.629-2.52.527-.937.527-1.874V31.064h4.981v23.204q0 2.753-2.52 5.449-3.046 3.222-7.617 3.281m14.766-.293V21.28h5.039v41.426zm7.91 0V57.96h4.629q2.284 0 3.867-2.05.762-1.056.762-1.993v-14.18q0-1.757-1.934-3.105-1.288-.879-2.637-.879h-4.687v-4.746h4.687q4.687 0 7.618 3.926 1.698 2.284 1.757 4.57v14.531q0 2.696-2.343 5.39-2.871 3.224-7.149 3.282zM53.34 47.186q0 4.4-1.92 7.92-1.92 3.518-5.28 5.6-3.36 1.999-7.84 2-2.7-.002-5.022-.73v-8q.578.545 1.263.97a7.27 7.27 0 0 0 3.76 1.04q2 0 3.68-1.04t2.64-2.8q1.04-1.76 1.04-3.92v-9.614a4.998 4.998 0 0 0 0-8.85V5.745h7.68zm-37.839-42.4q2.793 0 5.165.78v7.957a8 8 0 0 0-1.325-.978 7.4 7.4 0 0 0-3.84-1.04 7.4 7.4 0 0 0-3.84 1.04 8.05 8.05 0 0 0-2.72 2.8q-.96 1.76-.96 3.92v10.498a4.998 4.998 0 0 0 0 8.848v23.134H.3v-41.44q0-4.4 1.92-7.92t5.36-5.52q3.44-2.08 7.92-2.08m15.28 38.347h-.003v17.794a14 14 0 0 1-.397-.222q-3.36-2.08-5.28-5.6t-1.92-7.92v-7.998h7.6zM23.5 6.864q3.44 2 5.36 5.52t1.92 7.92v8.883h-7.6v-9.922q0-.25-.015-.494V6.67q.168.095.335.194"
              />
              <path
                fill="#78FCD6"
                d="M30.797 61.733a15.57 15.57 0 0 1-7.625-13.391v-9.158h7.625zM23.156 6.674a13.7 13.7 0 0 1 7.627 12.28v10.273h-7.627zm-12.142 31.17a3.752 3.752 0 0 1 0-7.504h31.613a3.752 3.752 0 0 1 0 7.504z"
              />
            </svg>

          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`px-4 py-2 rounded-full font-medium ${activeSection === item.href.substring(1)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <BookAppointmentButton
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full font-medium shadow-none"
              />
            </div>
            <div className="relative">
              <AccountMenu />
            </div>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-foreground shadow-none">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] shadow-none">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-muted-foreground hover:text-foreground text-lg py-2"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="mt-4">
                    <BookAppointmentButton
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-none"
                      fullWidth
                    />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
})
