'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AccountMenu } from '@/components/ui/account-menu'

export default function Navbar() {
  const { user, loading } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
              NurseHub
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            {/* Routes temporairement masquées */}
            {/* {!loading && user && (
              <>
                <Link href="/appointments" className="text-sm font-medium hover:text-primary">
                  My Appointments
                </Link>
              </>
            )} */}
          </div>

          <div className="flex items-center">
            {!loading && (
              <>
                {!user ? (
                  <div className="flex items-center space-x-4">
                    {/* Routes d'authentification temporairement masquées */}
                    {/* <Link href="/auth/login" className="text-sm font-medium hover:text-primary">
                      Sign In
                    </Link>
                    <Link href="/auth/register">
                      <Button>Create Account</Button>
                    </Link> */}
                    <span className="text-sm text-muted-foreground">Coming Soon</span>
                  </div>
                ) : (
                  <AccountMenu />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 