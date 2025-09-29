# Pasarela de Pagos - Crosspay Solutions (Prueba Técnica)

Una aplicación fullstack de pasarela de pagos desarrollada con Next.js, que incluye formulario de pagos y panel administrativo.

## 🚀 Características

- **Formulario de Pagos**: Interfaz segura para procesar transacciones
- **Panel Administrativo**: Dashboard con autenticación y gestión de transacciones
- **Múltiples Divisas**: Soporte para COP y USD
- **Autenticación JWT**: Sistema seguro de login para administradores
- **Responsive Design**: Optimizado para dispositivos móviles y desktop
- **Persistencia**: Sistema de almacenamiento basado en archivos JSON (demo)

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
- **File System** - Base de datos basada en archivos JSON

### Razones de la Elección del Stack

1. **Next.js**: Framework fullstack que permite desarrollo rápido con SSR/SSG
2. **TypeScript**: Mejora la calidad del código y reduce errores
3. **Tailwind CSS**: Desarrollo rápido de UI con utilidades CSS
4. **shadcn/ui**: Componentes accesibles y personalizables
5. **File System JSON**: Solución simple y transparente para demo local
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
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone https://github.com/bjisadorozco/crosspay-gateway-test.git
cd crosspay-gateway-test
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno (opcional)**
\`\`\`bash
# Crear archivo .env.local
JWT_SECRET=your-super-secret-jwt-key-change-in-production
\`\`\`

4. **Ejecutar en desarrollo**
\`\`\`bash
npm run dev
\`\`\`

5. **Abrir en el navegador**
\`\`\`
http://localhost:3000
\`\`\`

## 🔐 Credenciales de Acceso

### Panel Administrativo
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## 📁 Estructura del Proyecto

\`\`\`
crosspay-gateway/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx      # Login administrativo
│   │   └── page.tsx            # Dashboard admin
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts  # Endpoint de login
│   │   │   └── logout/route.ts # Endpoint de logout
│   │   └── transactions/
│   │       └── route.ts        # CRUD de transacciones
│   ├── payment/
│   │   ├── success/page.tsx    # Página de éxito
│   │   └── page.tsx            # Formulario de pago
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página de inicio
├── components/
│   ├── ui/                     # Componentes de UI
│   ├── admin-dashboard.tsx     # Dashboard administrativo
│   └── payment-form.tsx        # Formulario de pagos
├── lib/
│   ├── auth.ts                 # Utilidades de autenticación
│   ├── database.ts             # Operaciones de base de datos
│   └── utils.ts                # Utilidades generales
├── data/                       # Archivos de datos JSON
├── middleware.ts               # Middleware de autenticación
└── README.md
\`\`\`

## 🌐 Despliegue

### Vercel (nota importante)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno en el dashboard
3. Deploy automático

Importante: el almacenamiento en archivos JSON utiliza el sistema de archivos local del servidor. En plataformas serverless (como Vercel), este almacenamiento no es persistente. Para demo local funciona bien; para demo online estable se recomienda migrar a una base de datos administrada (p. ej., Postgres en Neon/Render) o usar SQLite en un entorno con disco persistente (Railway/Render).

### Otras Plataformas
- **Netlify**: Compatible con Next.js
- **Railway**: Soporte completo para Next.js
- **Heroku**: Con buildpack de Node.js

## 🔒 Seguridad

- **Enmascaramiento de datos**: Los números de tarjeta se almacenan parcialmente
- **JWT Tokens**: Autenticación stateless segura
- **HTTP-Only Cookies**: Prevención de ataques XSS
- **Validación de entrada**: Sanitización de todos los inputs
- **Middleware de protección**: Rutas administrativas protegidas

## 📦 Justificación de uso de JSON como almacenamiento (demo)

Para esta prueba técnica se priorizó la simplicidad y la transparencia del flujo end-to-end (UI → API → persistencia), por lo que se emplearon archivos JSON en `data/`:

- Simplicidad: evita la sobrecarga de provisionar DB, ORM y migraciones para una demo.
- Transparencia: los evaluadores pueden inspeccionar fácilmente los datos generados.
- Portabilidad: ejecutar localmente no requiere servicios externos (solo `npm run dev`).
- Seguridad básica: se enmascara el número de tarjeta y no se almacena el CVV.

Limitaciones: no es adecuado para concurrencia alta ni entornos serverless sin persistencia. En un entorno productivo, se migraría a Postgres + Prisma o SQLite según la plataforma de despliegue.

## 🚧 Posibles Mejoras

### Corto Plazo
- [ ] Integración con pasarela de pagos real (Stripe, PayU)
- [ ] Base de datos PostgreSQL/MongoDB
- [ ] Logs de auditoría
- [ ] Notificaciones por email
- [ ] Exportación de reportes (PDF)

### Mediano Plazo
- [ ] Autenticación OAuth (Google, GitHub)
- [ ] Dashboard con gráficos y métricas
- [ ] API de webhooks para integraciones
- [ ] Roles y permisos granulares
- [ ] Internacionalización (i18n)

### Largo Plazo
- [ ] Aplicación móvil (React Native)
- [ ] Microservicios con Docker
- [ ] Integración con blockchain
- [ ] Machine Learning para detección de fraude
- [ ] API GraphQL

## 🤝 Contribución

Este proyecto fue desarrollado como prueba técnica para Crosspay Solutions S.A.S.

## 📄 Licencia

Proyecto desarrollado para fines de evaluación técnica.

---

**Desarrollado con ❤️ para Crosspay Solutions S.A.S.**
