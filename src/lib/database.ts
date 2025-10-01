import { createServerClient } from "./supabase-server"

export interface Transaction {
  id: string
  currency: string
  amount: number
  description: string
  name: string
  status: "completed" | "pending" | "failed"
  documentType: string
  documentNumber: string
  cardNumber: string
  expiryDate: string
  securityCode: string
  createdAt: string
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
  console.log("💾 Iniciando guardado de transacción...")
  
  try {
    // Validar datos de entrada
    if (!transactionData.cardNumber || transactionData.cardNumber.length < 4) {
      throw new Error("Número de tarjeta inválido")
    }
    
    // Formatear el número de tarjeta para almacenamiento seguro
    const lastFourDigits = transactionData.cardNumber.replace(/\D/g, '').slice(-4)
    const maskedCard = `****-****-****-${lastFourDigits}`
    
    // Generar un ID único para la transacción
    const randomNum = Math.floor(100 + Math.random() * 900)
    const transactionId = `txn_test_${randomNum}`
    
    // Preparar datos de la transacción
    const transactionDataForDb = {
      id: transactionId,
      currency: transactionData.currency.toUpperCase(),
      amount: Number(transactionData.amount) || 0,
      description: transactionData.description.trim(),
      name: transactionData.name.trim(),
      status: 'completed' as const,
      documentType: transactionData.documentType,
      documentNumber: transactionData.documentNumber.trim(),
      cardNumber: maskedCard,
      expiryDate: transactionData.expiryDate,
      securityCode: '***',
      createdAt: new Date().toISOString(),
    }

    console.log("📝 Datos preparados:", {
      ...transactionDataForDb,
      securityCode: '***',
      cardNumber: maskedCard,
    })
    
    console.log("🔄 Insertando en Supabase...")
    
    // Usar el cliente del servidor
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionDataForDb)
      .select()
      .single()

    if (error) {
      console.error('❌ Error de Supabase:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      throw new Error(`Error al guardar la transacción: ${error.message}`)
    }

    if (!data) {
      throw new Error('No se recibieron datos de la transacción guardada')
    }

    console.log('✅ Transacción guardada exitosamente. ID:', data.id)
    return data as Transaction
    
  } catch (error) {
    console.error('❌ Error en saveTransaction:', error)
    
    if (error instanceof Error) {
      throw new Error(`Error al procesar la transacción: ${error.message}`)
    }
    
    throw new Error('Error desconocido al procesar la transacción')
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  console.log('🔍 Iniciando obtención de transacciones...')

  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Error de Supabase:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      throw new Error(`No se pudieron obtener las transacciones: ${error.message}`)
    }

    if (!Array.isArray(data)) {
      console.error('❌ Los datos no son un array:', data)
      return []
    }

    console.log(`✅ Se obtuvieron ${data.length} transacciones`)
    
    return data.map(transaction => ({
      id: transaction.id || '',
      currency: transaction.currency || '',
      amount: Number(transaction.amount) || 0,
      description: transaction.description || '',
      name: transaction.name || '',
      documentType: transaction.documentType || 'cedula',
      documentNumber: transaction.documentNumber || '',
      cardNumber: transaction.cardNumber || '',
      expiryDate: transaction.expiryDate || '',
      securityCode: transaction.securityCode || '***',
      status: (['completed', 'pending', 'failed'].includes(transaction.status) 
        ? transaction.status 
        : 'completed') as 'completed' | 'pending' | 'failed',
      createdAt: transaction.createdAt || new Date().toISOString(),
    }))
    
  } catch (error) {
    console.error('❌ Error en getTransactions:', error)
    throw error
  }
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  if (!id || typeof id !== 'string') {
    console.error('❌ ID inválido:', id)
    throw new Error('Se requiere un ID válido')
  }

  console.log(`🔍 Buscando transacción: ${id}`)
  
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('No rows found')) {
        console.log(`ℹ️ No se encontró la transacción: ${id}`)
        return null
      }
      
      console.error(`❌ Error al obtener transacción:`, error)
      throw new Error(`No se pudo obtener la transacción: ${error.message}`)
    }

    if (!data) {
      console.log(`ℹ️ No hay datos para: ${id}`)
      return null
    }

    console.log(`✅ Transacción obtenida: ${id}`)
    
    return {
      id: data.id || '',
      currency: data.currency || '',
      amount: Number(data.amount) || 0,
      description: data.description || '',
      name: data.name || '',
      documentType: data.documentType || 'cedula',
      documentNumber: data.documentNumber || '',
      cardNumber: data.cardNumber || '',
      expiryDate: data.expiryDate || '',
      securityCode: data.securityCode || '***',
      status: (['completed', 'pending', 'failed'].includes(data.status) 
        ? data.status 
        : 'completed') as 'completed' | 'pending' | 'failed',
      createdAt: data.createdAt || new Date().toISOString(),
    }
    
  } catch (error) {
    console.error(`❌ Error en getTransactionById:`, error)
    throw error
  }
}

export async function validateUser(username: string, password: string): Promise<User | null> {
  if (!username || !password) {
    console.error('❌ Usuario y contraseña requeridos')
    return null
  }

  console.log(`🔐 Validando usuario: ${username}`)
  
  try {
    const supabase = createServerClient()
    
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username.trim())
      .single()

    if (userError) {
      if (userError.code === 'PGRST116' || userError.message.includes('No rows found')) {
        console.log(`ℹ️ Usuario no encontrado: ${username}`)
        return null
      }
      
      console.error('❌ Error al buscar usuario:', userError)
      return null
    }

    if (!userData) {
      console.log(`ℹ️ No hay datos para: ${username}`)
      return null
    }

    // Verificar contraseña (en producción usa bcrypt)
    if (userData.password !== password) {
      console.log('❌ Contraseña incorrecta')
      return null
    }

    console.log(`✅ Usuario autenticado: ${username}`)
    
    return {
      id: userData.id || '',
      username: userData.username || '',
      password: '',
      role: userData.role === 'admin' ? 'admin' as const : 'admin',
      createdAt: userData.createdAt || new Date().toISOString(),
    }
    
  } catch (error) {
    console.error('❌ Error al validar usuario:', error)
    return null
  }
}

export async function getUsers(): Promise<User[]> {
  console.log('👥 Obteniendo usuarios...')
  
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("createdAt", { ascending: false })

    if (error) {
      console.error('❌ Error al obtener usuarios:', error)
      throw new Error(`No se pudieron obtener los usuarios: ${error.message}`)
    }

    if (!Array.isArray(data)) {
      console.error('❌ Los datos no son un array:', data)
      return []
    }

    console.log(`✅ Se obtuvieron ${data.length} usuarios`)
    
    return data.map(user => ({
      id: user.id || '',
      username: user.username || '',
      password: '',
      role: user.role === 'admin' ? 'admin' as const : 'admin',
      createdAt: user.createdAt || new Date().toISOString(),
    }))
    
  } catch (error) {
    console.error('❌ Error en getUsers:', error)
    throw error
  }
}