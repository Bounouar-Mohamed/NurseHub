import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Bloquer toutes les routes sauf la page d'accueil
  const { pathname } = request.nextUrl
  
  // Permettre seulement la page d'accueil et les assets statiques
  if (pathname === '/' || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') ||
      pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // Rediriger toutes les autres routes vers la page d'accueil
  return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 