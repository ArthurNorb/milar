import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')

  if (!isAdminRoute) return NextResponse.next()

  // O proxy é só UX; a proteção real está em requireAdmin() nas actions/routes.
  const isLoggedIn = await verifySession(request.cookies.get(SESSION_COOKIE)?.value)

  // Visitante sem sessão tentando acessar o painel → login
  if (!isLoggedIn && pathname !== '/admin') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Usuário logado na tela de login → dashboard
  if (isLoggedIn && pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Ignora estáticos do Next, favicon e arquivos de imagem/fonte servidos de /public
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?)$).*)',
  ],
}
