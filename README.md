# Pasarela de Pagos - Crosspay Solutions (Prueba Técnica)

Una aplicación fullstack de pasarela de pagos desarrollada con Next.js, que incluye formulario de pagos y panel administrativo.

## 🚀 Características

- **Formulario de Pagos**: Interfaz segura para procesar transacciones  
- **Panel Administrativo**: Dashboard con autenticación y gestión de transacciones  
- **Múltiples Divisas**: Soporte para COP y USD  
- **Autenticación JWT**: Sistema seguro de login para administradores  
- **Responsive Design**: Optimizado para dispositivos móviles y desktop  
- **Persistencia en Supabase**: Todas las transacciones y usuarios se almacenan en PostgreSQL gestionado por Supabase  

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React con App Router  
- **TypeScript** - Tipado estático  
- **Tailwind CSS** - Framework de estilos  
- **shadcn/ui** - Componentes de UI  
- **Lucide React** - Iconos  

### Backend
- **Next.js API Routes** - Endpoints REST  
- **JWT (jose)** - Autenticación y autorización  
- **Supabase (PostgreSQL)** - Persistencia en la nube  

### Razones de la Elección del Stack

1. **Next.js**: Framework fullstack que permite desarrollo rápido con SSR/SSG  
2. **TypeScript**: Mejora la calidad del código y reduce errores  
3. **Tailwind CSS**: Desarrollo rápido de UI con utilidades CSS  
4. **shadcn/ui**: Componentes accesibles y personalizables  
5. **Supabase (Postgres)**: Base de datos administrada, persistente y con seguridad integrada (RLS)  
6. **JWT**: Estándar de la industria para autenticación stateless  

## 📋 Funcionalidades

### Formulario de Pagos
- ✅ Selección de divisa (COP/USD)  
- ✅ Monto de transacción  
- ✅ Descripción de la transacción  
- ✅ Información personal (nombre, tipo y número de documento)  
- ✅ Datos de tarjeta (número, fecha de vencimiento, código de seguridad)  
- ✅ Validación de formularios  
- ✅ Formateo automático de campos  
- ✅ Página de confirmación  

### Panel Administrativo
- ✅ Login con usuario y contraseña  
- ✅ Dashboard con estadísticas  
- ✅ Listado completo de transacciones  
- ✅ Filtros por divisa y búsqueda  
- ✅ Información detallada de cada transacción  
- ✅ Logout seguro  
- ✅ Exportación a CSV desde el panel (compatible con Excel)  

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+  
- npm  

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/bjisadorozco/crosspay-gateway-test.git
cd crosspay-gateway-test
```
2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno (opcional)**
```bash
# Crear archivo .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
\`\`\`
http://localhost:3000
\`\`\`

## 🔐 Credenciales de Acceso

### Panel Administrativo
- **Usuario**: `admin`
- **Contraseña**: `admin123`
(Debes tener este usuario creado en la tabla users de Supabase)

## 📁 Estructura del Proyecto

\`\`\`
crosspay-gateway/
├── app/
│   ├── admin/                  # Rutas administrativas
│   ├── api/                    # Endpoints API
│   ├── payment/                # Rutas de pagos
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página de inicio
├── components/                 # Componentes UI y de negocio
│   ├── ui/                     # Componentes de UI reutilizables
│   ├── admin-dashboard.tsx     # Dashboard administrativo
│   └── payment-form.tsx        # Formulario de pagos
├── lib/                        # Utilidades y conexión
│   ├── auth.ts                 # Utilidades de autenticación
│   ├── supabase.ts             # Cliente Supabase
│   └── utils.ts                # Funciones utilitarias
├── public/                     # Recursos estáticos
├── styles/                     # Estilos adicionales
├── middleware.ts               # Middleware de autenticación
├── package.json
└── README.md
\`\`\`

## 🌐 Despliegue

### Vercel (nota importante)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno en el dashboard de Vercel
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    - JWT_SECRET
3. Deploy automático

✅ Con Supabase, los datos ahora son persistentes y no dependen del sistema de archivos del servidor.

## 🔒 Seguridad

- **Enmascaramiento de datos**: Los números de tarjeta se almacenan parcialmente
- **JWT Tokens**: Autenticación stateless segura
- **HTTP-Only Cookies**: Prevención de ataques XSS
- **Validación de entrada**: Sanitización de todos los inputs
- **Middleware de protección**: Rutas administrativas protegidas
- **Supabase RLS**: Control de acceso seguro en la base de datos

## 🚧 Posibles Mejoras

### Corto Plazo
- [ ] Integración con una pasarela de pagos real (Stripe, PayU, MercadoPago)  
- [ ] Validaciones avanzadas en formularios (regex para tarjetas, expiración dinámica, Luhn check)  
- [ ] Manejo de errores y mensajes más amigables en la UI  
- [ ] Envío automático de correos de confirmación de transacción  
- [ ] Exportación de reportes en PDF desde el panel administrativo  

### Mediano Plazo
- [ ] Autenticación con OAuth (Google, GitHub) además del login clásico  
- [ ] Dashboard con gráficos interactivos (Recharts o Chart.js)  
- [ ] Sistema de logs de auditoría (acciones de admin y transacciones críticas)  
- [ ] Implementación de webhooks para notificaciones en tiempo real  
- [ ] Roles y permisos (ej: Admin, Auditor, Operador)  

### Largo Plazo
- [ ] Aplicación móvil (React Native/Expo) para clientes y administradores  
- [ ] Arquitectura con microservicios y Docker para escalar  
- [ ] Sistema de detección de fraude con machine learning (basado en patrones de transacciones)  
- [ ] Integración con blockchain para trazabilidad de pagos  
- [ ] API GraphQL para clientes externos e integraciones más flexibles  


## 🤝 Contribución

Este proyecto fue desarrollado como prueba técnica para Crosspay Solutions S.A.S.

## 📄 Licencia

Proyecto desarrollado para fines de evaluación técnica.

---

**Desarrollado con ❤️ para Crosspay Solutions S.A.S.**
