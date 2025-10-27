import Link from "next/link"
import { CreditCard, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Logo } from "@/components/ui/logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin"
                    className="text-muted-foreground hover:text-foreground transition-colors rounded-lg px-3 py-2 hover:bg-muted/50 inline-flex items-center gap-2"
                    aria-label="Admin"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">Panel Administrativo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>
      </header>

      {/* Página de inicio */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Procesamiento de pagos
            <span className="text-primary"> seguro y confiable</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Solución profesional de pasarela de pagos para empresas que buscan procesar transacciones de forma segura y
            eficiente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/payment">Realizar Pago</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/admin">Panel Administrativo</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Seguridad Avanzada</h3>
              <p className="text-muted-foreground">Protección de datos con los más altos estándares de seguridad</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Múltiples Divisas</h3>
              <p className="text-muted-foreground">Soporte para COP y USD con conversión automática</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Panel Administrativo</h3>
              <p className="text-muted-foreground">Gestión completa de transacciones y reportes en tiempo real</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Crosspay Solutions S.A.S. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
