import { promises as fs } from "fs"
import path from "path"

export interface Transaction {
  id: string
  currency: string
  amount: number
  description: string
  name: string
  documentType: string
  documentNumber: string
  cardNumber: string // Only last 4 digits stored
  expiryDate: string
  securityCode: string // Not stored in real implementation
  createdAt: string
  status: "completed" | "pending" | "failed"
}

export interface User {
  id: string
  username: string
  password: string // In real app, this would be hashed
  role: "admin"
  createdAt: string
}

// 🔹 Arrays en memoria (se reinician en cada redeploy o reinicio del serverless)
let transactions: Transaction[] = []
let users: User[] = [
  {
    id: "admin-1",
    username: "admin",
    password: "admin123", // En producción debería estar hasheado
    role: "admin",
    createdAt: new Date().toISOString(),
  },
]

// Transaction operations
export async function saveTransaction(
  transactionData: Omit<Transaction, "id" | "createdAt" | "status">,
): Promise<Transaction> {
  const transaction: Transaction = {
    ...transactionData,
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    cardNumber: `****-****-****-${transactionData.cardNumber.slice(-4)}`, // Mask card number
    securityCode: "***", // Nunca guardar el CVV real
    createdAt: new Date().toISOString(),
    status: "completed", // Simulación de pago exitoso
  }

  transactions.push(transaction)
  return transaction
}

export async function getTransactions(): Promise<Transaction[]> {
  return transactions
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  return transactions.find((t) => t.id === id) || null
}

// User operations
export async function validateUser(username: string, password: string): Promise<User | null> {
  const user = users.find((u) => u.username === username && u.password === password)
  return user || null
}

export async function getUsers(): Promise<User[]> {
  return users
}
