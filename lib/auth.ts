import { jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export interface AuthUser {
  userId: string
  username: string
  role: string
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token.value, JWT_SECRET)

    return {
      userId: payload.userId as string,
      username: payload.username as string,
      role: payload.role as string,
    }
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  return user
}
