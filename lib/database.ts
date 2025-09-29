import { supabase } from "@/lib/supabase"

export interface Transaction {
  id: string
  currency: string
  amount: number
  description: string
  name: string
  documentType: string
  documentNumber: string
  cardNumber: string
  expiryDate: string
  securityCode: string
  createdAt: string
  status: "completed" | "pending" | "failed"
}

export interface User {
  id: string
  username: string
  password: string
  role: "admin"
  createdAt: string
}

export async function saveTransaction(
  transactionData: Omit<Transaction, "id" | "createdAt" | "status">,
): Promise<Transaction> {
  const transaction: Transaction = {
    ...transactionData,
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    cardNumber: `****-****-****-${transactionData.cardNumber.slice(-4)}`,
    securityCode: "***",
    createdAt: new Date().toISOString(),
    status: "completed",
  }

  const { error } = await supabase.from("transactions").insert(transaction)
  if (error) {
    throw error
  }
  return transaction
}

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("createdAt", { ascending: false })

  if (error) {
    throw error
  }
  return (data as Transaction[]) || []
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const { data, error } = await supabase.from("transactions").select("*").eq("id", id).single()
  if (error) {
    return null
  }
  return (data as Transaction) || null
}

export async function validateUser(username: string, password: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single()

  if (error) {
    return null
  }
  return data as User
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*").order("createdAt", { ascending: false })
  if (error) {
    throw error
  }
  return (data as User[]) || []
}
