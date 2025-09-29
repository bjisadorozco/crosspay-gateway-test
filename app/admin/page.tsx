import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { getTransactions } from "@/lib/database"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/admin/login")
  }

  const transactions = await getTransactions()

  return <AdminDashboard user={user} transactions={transactions} />
}
