/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  // Configuración de alias de rutas
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(process.cwd(), 'src'),
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['wlignqkaserrrnbcuniv.supabase.co'],
  },
  // Configuración de servidor
  serverRuntimeConfig: {
    // Aquí van las configuraciones que solo están disponibles en el servidor
  },
  publicRuntimeConfig: {
    // Aquí van las configuraciones disponibles tanto en el servidor como en el cliente
    apiUrl: process.env.NODE_ENV === 'production' 
      ? 'https://tudominio.com/api' 
      : 'http://localhost:3000/api',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey' },
        ],
      },
    ]
  },
  // Configuración de seguridad adicional
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compress: true,
  // Configuración del servidor de desarrollo
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  // Configuración de redirecciones
  async redirects() {
    return [
      // Aquí puedes agregar redirecciones personalizadas si es necesario
    ]
  },
}

export default nextConfig
