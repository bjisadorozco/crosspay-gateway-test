"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Lock, Shield, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface PaymentData {
  currency: string
  amount: string
  description: string
  name: string
  documentType: string
  documentNumber: string
  cardNumber: string
  expiryDate: string
  securityCode: string
}

export function PaymentForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [formData, setFormData] = useState<PaymentData>({
    currency: "",
    amount: "",
    description: "",
    name: "",
    documentType: "",
    documentNumber: "",
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
  })

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "")
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`
    }
    return v
  }

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value)
    handleInputChange("cardNumber", formatted)
  }

  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value)
    handleInputChange("expiryDate", formatted)
  }

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setNotification({ type: null, message: "" })

    try {
      console.log("[v0] Sending payment data:", formData)
      
      // Obtener la URL base de la API desde la configuración
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const endpoint = `${apiUrl}/transactions`;
      
      console.log("[v0] Sending request to:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log("[v0] API Response:", result)

      if (response.ok) {
        try {
          const localListRaw = typeof window !== "undefined" ? localStorage.getItem("transactions") : null
          const localList: any[] = localListRaw ? JSON.parse(localListRaw) : []
          const maskedCard = `****-****-****-${formData.cardNumber.replace(/\s/g, "").slice(-4)}`
          const clientTransaction = {
            id: result.id,
            currency: formData.currency,
            amount: Number.parseFloat(formData.amount),
            description: formData.description.trim(),
            name: formData.name.trim(),
            documentType: formData.documentType,
            documentNumber: formData.documentNumber.trim(),
            cardNumber: maskedCard,
            expiryDate: formData.expiryDate,
            securityCode: "***",
            createdAt: new Date().toISOString(),
            status: "completed",
          }
          localList.push(clientTransaction)
          if (typeof window !== "undefined") {
            localStorage.setItem("transactions", JSON.stringify(localList))
          }
        } catch { }

        setNotification({
          type: "success",
          message: "Pago procesado exitosamente. Redirigiendo...",
        })

        setTimeout(() => {
          router.push(`/payment/success?id=${result.id}`)
        }, 2000)
      } else {
        setNotification({
          type: "error",
          message: result.error || "Error al procesar el pago",
        })
      }
    } catch (error) {
      console.error("[v0] Payment error:", error)
      setNotification({
        type: "error",
        message: "Error de conexión. Por favor intente nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "")

  return (
    <Card className="w-full">
      {notification.type && (
        <div
          className={`fixed top-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3
                    text-sm sm:text-base
                    w-[90%] max-w-sm left-1/2 -translate-x-1/2 
                    sm:w-auto sm:max-w-none sm:right-4 sm:left-auto sm:translate-x-0
                    ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >      
          {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification({ type: null, message: "" })}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Información de Pago</CardTitle>
        <CardDescription>Ingrese los datos de su transacción de forma segura</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Detalles de la Transacción
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Divisa *</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar divisa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                    <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción de la transacción *</Label>
              <Textarea
                id="description"
                placeholder="Describe el motivo de la transacción"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Información Personal</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ingrese su nombre completo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de documento *</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) => handleInputChange("documentType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cedula">Cédula de Ciudadanía</SelectItem>
                    <SelectItem value="pasaporte">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentNumber">Número de documento *</Label>
                <Input
                  id="documentNumber"
                  type="text"
                  placeholder="Número de documento"
                  value={formData.documentNumber}
                  onChange={(e) => handleInputChange("documentNumber", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Información de la Tarjeta
            </h3>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de tarjeta *</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Fecha de vencimiento *</Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/AA"
                  value={formData.expiryDate}
                  onChange={(e) => handleExpiryDateChange(e.target.value)}
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityCode">Código de seguridad *</Label>
                <Input
                  id="securityCode"
                  type="text"
                  placeholder="123"
                  value={formData.securityCode}
                  onChange={(e) => handleInputChange("securityCode", e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Transacción Segura</p>
                <p>
                  Sus datos están protegidos con encriptación de nivel bancario. Esta es una simulación para fines de
                  demostración.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full text-lg py-6" disabled={!isFormValid || isLoading}>
            {isLoading ? "Procesando..." : "Procesar Pago"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
