import { PaymentForm } from "@/components/payment-form"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { Home, Shield } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    <span className="hidden md:inline">Inicio</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">Ir a la página de inicio</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">Ir al panel administrativo</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>
      </header>

      {/* Payment Form Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Procesar Pago</h1>
            <p className="text-muted-foreground">
              Complete la información para procesar su transacción de forma segura
            </p>
          </div>

          <PaymentForm />
        </div>
      </main>
    </div>
  )
}
