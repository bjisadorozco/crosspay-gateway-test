import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

// Lista de rutas que requieren autenticación
const protectedRoutes = [
  "/api/admin"
  // La ruta de transacciones no requiere autenticación para permitir pagos
  // Agrega aquí otras rutas que requieran autenticación
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  
  // Configuración CORS
  requestHeaders.set('Access-Control-Allow-Credentials', 'true')
  requestHeaders.set('Access-Control-Allow-Origin', '*')
  requestHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  requestHeaders.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  // Manejar solicitudes OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    // Aplicar las cabeceras CORS
    requestHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Proteger rutas de administrador
  if (pathname.startsWith("/admin")) {
    // Permitir acceso sin autenticación a la página de inicio de sesión
    if (pathname === "/admin/login") {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    const token = request.cookies.get("auth-token")

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url), {
        headers: requestHeaders,
      })
    }

    try {
      await jwtVerify(token.value, JWT_SECRET)
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url), {
        headers: requestHeaders,
      })
    }
  }

  // Para rutas de API que requieren autenticación
  const requiresAuth = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (requiresAuth) {
    const token = request.headers.get('authorization')?.split(' ')[1] ||
                 request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401, headers: requestHeaders }
      )
    }

    try {
      await jwtVerify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401, headers: requestHeaders }
      )
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ],
}
