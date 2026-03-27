import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const getCookieConfig = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      cookies: {
        getAll() { return [] },
        setAll() { },
      },
    }
  }

  return {
    cookies: {
      getAll() {
        return document.cookie.split(';').map(cookie => {
          const [name, ...valueParts] = cookie.trim().split('=')
          const value = valueParts.join('=')
          return { name, value }
        })
      },
      setAll(cookies: { name: string; value: string; options?: any }[]) {
        cookies.forEach(({ name, value, options }) => {
          let cookieString = `${name}=${value}`
          if (options) {
            if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`
            if (options.path) cookieString += `; Path=${options.path}`
            if (options.domain) cookieString += `; Domain=${options.domain}`
            if (options.secure) cookieString += '; Secure'
            if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`
          }
          document.cookie = cookieString
        })
      },
    },
  }
}

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  getCookieConfig()
)