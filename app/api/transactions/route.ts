import { type NextRequest, NextResponse } from "next/server"
import { saveTransaction, getTransactions } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const requiredFields = [
      "currency",
      "amount",
      "description",
      "name",
      "documentType",
      "documentNumber",
      "cardNumber",
      "expiryDate",
      "securityCode",
    ]

    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === "") {
        return NextResponse.json({ error: `El campo ${field} es obligatorio` }, { status: 400 })
      }
    }
    if (!["COP", "USD"].includes(body.currency)) {
      return NextResponse.json({ error: "La divisa debe ser COP o USD" }, { status: 400 })
    }
    const amount = Number.parseFloat(body.amount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "El monto debe ser un número positivo" }, { status: 400 })
    }
    if (!["cedula", "pasaporte"].includes(body.documentType)) {
      return NextResponse.json({ error: "El tipo de documento debe ser cedula o pasaporte" }, { status: 400 })
    }
    const cardNumber = body.cardNumber.replace(/\s/g, "")
    if (!/^\d{16}$/.test(cardNumber)) {
      return NextResponse.json({ error: "El número de tarjeta debe tener 16 dígitos" }, { status: 400 })
    }
    if (!/^\d{2}\/\d{2}$/.test(body.expiryDate)) {
      return NextResponse.json({ error: "La fecha de vencimiento debe tener el formato MM/AA" }, { status: 400 })
    }
    if (!/^\d{3,4}$/.test(body.securityCode)) {
      return NextResponse.json({ error: "El código de seguridad debe tener 3 o 4 dígitos" }, { status: 400 })
    }
    const transaction = await saveTransaction({
      currency: body.currency,
      amount: amount,
      description: body.description.trim(),
      name: body.name.trim(),
      documentType: body.documentType,
      documentNumber: body.documentNumber.trim(),
      cardNumber: cardNumber,
      expiryDate: body.expiryDate,
      securityCode: body.securityCode,
    })

    return NextResponse.json({
      success: true,
      id: transaction.id,
      message: "Transacción procesada exitosamente",
    })
  } catch (error) {
    console.error("Error procesando la transacción:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const transactions = await getTransactions()
    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error obteniendo transacciones:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
