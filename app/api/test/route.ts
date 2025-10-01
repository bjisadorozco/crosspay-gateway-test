import { supabaseServer as supabase } from "@/src/lib/supabase-server"

export async function GET() {
    try {
        const { data, error } = await supabase.from("transactions").select("*").limit(1)

        if (error) {
            console.error("❌ Error Supabase:", error)
            return Response.json({ error: error.message }, { status: 500 })
        }

        return Response.json({ ok: true, data })
    } catch (err: any) {
        console.error("❌ Error inesperado:", err)
        return Response.json({ error: err.message }, { status: 500 })
    }
}
