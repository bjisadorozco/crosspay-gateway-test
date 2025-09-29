"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/ui/logo"
import { LogOut, Search, Filter, Download, CreditCard, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Transaction } from "@/lib/database"
import type { AuthUser } from "@/lib/auth"

interface AdminDashboardProps {
  user: AuthUser
  transactions: Transaction[]
}

export function AdminDashboard({ user, transactions }: AdminDashboardProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [currencyFilter, setCurrencyFilter] = useState("all")
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const headers = [
    "ID",
    "Divisa",
    "Monto",
    "Descripción",
    "Nombre",
    "Tipo de Documento",
    "Número de Documento",
    "Fecha",
    "Estado",
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCurrency = currencyFilter === "all" || transaction.currency === currencyFilter

    return matchesSearch && matchesCurrency
  })

  // Calculate statistics
  const totalTransactions = transactions.length
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
  const copTransactions = transactions.filter((t) => t.currency === "COP")
  const usdTransactions = transactions.filter((t) => t.currency === "USD")

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const escapeCsv = (value: unknown) => {
    if (value === null || value === undefined) return ""
    const str = String(value)
    // Escapar comillas dobles y encerrar si contiene separador, salto de línea o comillas
    const needsQuotes = /[";\n]/.test(str)
    const escaped = str.replace(/"/g, '""')
    return needsQuotes ? `"${escaped}"` : escaped
  }

  const handleExport = () => {
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.currency,
      // Monto sin formato para que Excel lo reconozca como número
      t.amount,
      t.description,
      t.name,
      t.documentType,
      t.documentNumber,
      // Fecha legible
      formatDate(t.createdAt),
      // Estado en español
      t.status === "completed" ? "Completada" : "Pendiente",
    ])

    const delimiter = ";" // Usar punto y coma para configuración regional en español
    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(delimiter))
      .join("\r\n")

    // Agregar BOM para que Excel detecte UTF-8 correctamente
    const bom = "\uFEFF"
    const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transacciones_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Bienvenido, <span className="font-medium text-foreground">{user.username}</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="w-4 h-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">
                {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Panel Administrativo</h1>
          <p className="text-muted-foreground">Gestión y monitoreo de transacciones</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">Todas las transacciones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transacciones COP</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{copTransactions.length}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(
                  copTransactions.reduce((sum, t) => sum + t.amount, 0),
                  "COP",
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transacciones USD</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usdTransactions.length}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(
                  usdTransactions.reduce((sum, t) => sum + t.amount, 0),
                  "USD",
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Activo</div>
              <p className="text-xs text-muted-foreground">Sistema operativo</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Listado de Transacciones</CardTitle>
                <CardDescription>Historial completo de todas las transacciones procesadas</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredTransactions.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, descripción o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por divisa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las divisas</SelectItem>
                  <SelectItem value="COP">COP</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron transacciones</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Divisa</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo de Documento</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-xs">{transaction.id.substring(0, 12)}...</TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.currency}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                        <TableCell>{transaction.name}</TableCell>
                        <TableCell className="capitalize">{transaction.documentType}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={transaction.status === "completed" ? "default" : "secondary"}
                            className={transaction.status === "completed" ? "bg-green-100 text-green-800" : ""}
                          >
                            {transaction.status === "completed" ? "Completada" : "Pendiente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
