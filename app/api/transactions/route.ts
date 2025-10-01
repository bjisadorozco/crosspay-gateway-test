import { type NextRequest, NextResponse } from "next/server"
import { saveTransaction, getTransactions } from "@/src/lib/database"

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 Iniciando procesamiento de transacción...');
    const body = await request.json();
    console.log('📦 Datos recibidos:', JSON.stringify(body, null, 2));
    
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

    // Validar campos requeridos
    const missingFields = requiredFields.filter(field => !body[field] || body[field].toString().trim() === "");
    if (missingFields.length > 0) {
      console.error('❌ Campos faltantes:', missingFields);
      return NextResponse.json(
        { 
          error: 'Campos obligatorios faltantes',
          missingFields,
          receivedData: body 
        }, 
        { status: 400 }
      );
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
    console.log('💾 Intentando guardar transacción...');
    try {
      console.log('🔵 Datos recibidos para la transacción:', {
        currency: body.currency,
        amount: amount,
        description: body.description.trim(),
        name: body.name.trim(),
        documentType: body.documentType,
        documentNumber: body.documentNumber.trim(),
        cardNumber: '****' + cardNumber.slice(-4),
        expiryDate: body.expiryDate,
        securityCode: '***'
      });
      
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
      });

      console.log('✅ Transacción guardada exitosamente:', transaction.id);
      
      return NextResponse.json({
        success: true,
        id: transaction.id,
        message: "Transacción procesada exitosamente",
      }, { status: 200 });
      
    } catch (error: unknown) {
      console.error('❌ Error al guardar la transacción:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      return NextResponse.json(
        { 
          error: 'Error al procesar la transacción',
          details: errorMessage,
          ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
        }, 
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('❌ Error inesperado en el servidor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('🔍 Obteniendo lista de transacciones...');
    const transactions = await getTransactions();
    console.log(`✅ Se encontraron ${transactions.length} transacciones`);
    
    return NextResponse.json(transactions, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
    
  } catch (error: unknown) {
    console.error('❌ Error al obtener transacciones:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Error al obtener las transacciones',
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
