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

const DATA_DIR = path.join(process.cwd(), "data")
const TRANSACTIONS_FILE = path.join(DATA_DIR, "transactions.json")
const USERS_FILE = path.join(DATA_DIR, "users.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize default admin user
async function initializeUsers() {
  try {
    await fs.access(USERS_FILE)
  } catch {
    const defaultUsers: User[] = [
      {
        id: "admin-1",
        username: "admin",
        password: "admin123", // In production, this would be hashed
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ]
    await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2))
  }
}

// Transaction operations
export async function saveTransaction(
  transactionData: Omit<Transaction, "id" | "createdAt" | "status">,
): Promise<Transaction> {
  await ensureDataDir()

  const transaction: Transaction = {
    ...transactionData,
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    cardNumber: `****-****-****-${transactionData.cardNumber.slice(-4)}`, // Mask card number
    securityCode: "***", // Never store security code
    createdAt: new Date().toISOString(),
    status: "completed", // Simulate successful payment
  }

  let transactions: Transaction[] = []
  try {
    const data = await fs.readFile(TRANSACTIONS_FILE, "utf-8")
    transactions = JSON.parse(data)
  } catch {
    // File doesn't exist, start with empty array
  }

  transactions.push(transaction)
  await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2))

  return transaction
}

export async function getTransactions(): Promise<Transaction[]> {
  await ensureDataDir()

  try {
    const data = await fs.readFile(TRANSACTIONS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const transactions = await getTransactions()
  return transactions.find((t) => t.id === id) || null
}

// User operations
export async function validateUser(username: string, password: string): Promise<User | null> {
  await ensureDataDir()
  await initializeUsers()

  try {
    const data = await fs.readFile(USERS_FILE, "utf-8")
    const users: User[] = JSON.parse(data)

    const user = users.find((u) => u.username === username && u.password === password)
    return user || null
  } catch {
    return null
  }
}

export async function getUsers(): Promise<User[]> {
  await ensureDataDir()
  await initializeUsers()

  try {
    const data = await fs.readFile(USERS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}
