import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cookie configuration for browser environment
const getCookieConfig = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Server-side or Node.js environment - provide dummy cookie handlers
    return {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // No-op
        },
      },
    }
  }

  // Browser environment - use document.cookie
  return {
    cookies: {
      getAll() {
        const cookies = document.cookie.split(';').map(cookie => {
          const [name, ...valueParts] = cookie.trim().split('=')
          const value = valueParts.join('=')
          return { name, value }
        })
        return cookies
      },
      setAll(cookies) {
        cookies.forEach(({ name, value, options }) => {
          let cookieString = `${name}=${value}`

          if (options) {
            if (options.maxAge) {
              cookieString += `; Max-Age=${options.maxAge}`
            }
            if (options.expires) {
              const expires = options.expires instanceof Date
                ? options.expires.toUTCString()
                : options.expires
              cookieString += `; Expires=${expires}`
            }
            if (options.domain) {
              cookieString += `; Domain=${options.domain}`
            }
            if (options.path) {
              cookieString += `; Path=${options.path}`
            }
            if (options.secure) {
              cookieString += '; Secure'
            }
            if (options.httpOnly) {
              cookieString += '; HttpOnly'
            }
            if (options.sameSite) {
              cookieString += `; SameSite=${options.sameSite}`
            }
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