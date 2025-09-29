import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      {/* Success Message */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-600">¡Pago Procesado!</CardTitle>
              <CardDescription>Su transacción ha sido procesada exitosamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Recibirá un correo de confirmación con los detalles de su transacción.
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <Link href="/">Volver al Inicio</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/payment">Realizar Otro Pago</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
