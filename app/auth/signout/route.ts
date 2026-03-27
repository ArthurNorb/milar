import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()

    await supabase.auth.signOut()

    return NextResponse.redirect(new URL('/admin', request.url), {
      status: 303,
    })
  } catch (error) {
    console.error('Erro ao sair:', error)

    return NextResponse.redirect(new URL('/admin', request.url), {
      status: 303,
    })
  }
}