export interface Producto {
  _id: string
  nombre: string
  imagen: string | null // base64 data URL
  precio: number
  esActivo: boolean
}

export interface ProductoDetalle {
  _id: string
  nombre: string
  descripcion: string
  tiempo_preparacion: number
  ingredientes: string[]
  imagen: string | null
  precio: number
  esActivo: boolean
}

export interface CreateProductoInput {
  nombre: string
  descripcion: string
  tiempo_preparacion: number
  ingredientes: string[]
  precio: number
  imagen?: File | null
}

export interface UpdateProductoInput {
  nombre?: string
  descripcion?: string
  tiempo_preparacion?: number
  ingredientes?: string[]
  precio?: number
  imagen?: File | null
}

export interface UpdateProductsStatusInput {
  ids: string[]
  esActivo: boolean
}

// CSV row shape (after parsing)
export interface CsvProductoRow {
  nombre: string
  descripcion: string
  tiempo_preparacion: number
  ingredientes: string[]
  precio: number
}
