import { apiClient } from "@/lib/api/apiClient"
import type {
  Producto,
  ProductoDetalle,
  UpdateProductsStatusInput,
  CreateProductoInput,
  UpdateProductoInput,
  CsvProductoRow,
} from "./shared/types/producto.type"

const API_URL = () => {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (!url) throw new Error("NEXT_PUBLIC_API_URL no está definida")
  return url
}

export async function getProducts(): Promise<Producto[]> {
  return apiClient.get<Producto[]>("/admin/productos")
}

export async function getIngredientes(): Promise<string[]> {
  return apiClient.get<string[]>("/admin/productos/ingredientes")
}

export async function getProductById(id: string): Promise<ProductoDetalle> {
  return apiClient.get<ProductoDetalle>(`/admin/productos/${id}`)
}

// Single product — multipart/form-data (supports image)
export async function createProduct(input: CreateProductoInput): Promise<void> {
  const form = new FormData()
  form.append("nombre", input.nombre)
  form.append("descripcion", input.descripcion)
  form.append("tiempo_preparacion", String(input.tiempo_preparacion))
  form.append("ingredientes", JSON.stringify(input.ingredientes))
  form.append("precio", String(input.precio))
  if (input.imagen) form.append("imagen", input.imagen)

  const res = await fetch(`${API_URL()}/admin/productos`, {
    method: "POST",
    body: form,
  })
  if (!res.ok) {
    const json = await res.json().catch(() => null) as { message?: string } | null
    throw new Error(json?.message ?? `Error ${res.status}: ${res.statusText}`)
  }
}

// Multiple products — JSON array (no images)
export async function createProducts(rows: CsvProductoRow[]): Promise<void> {
  const res = await fetch(`${API_URL()}/admin/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => null) as { message?: string } | null
    throw new Error(json?.message ?? `Error ${res.status}: ${res.statusText}`)
  }
}

export async function updateProduct(
  id: string,
  input: UpdateProductoInput
): Promise<void> {
  const form = new FormData()
  if (input.nombre !== undefined) form.append("nombre", input.nombre)
  if (input.descripcion !== undefined) form.append("descripcion", input.descripcion)
  if (input.tiempo_preparacion !== undefined)
    form.append("tiempo_preparacion", String(input.tiempo_preparacion))
  if (input.precio !== undefined) form.append("precio", String(input.precio))
  if (input.ingredientes !== undefined)
    form.append("ingredientes", JSON.stringify(input.ingredientes))
  if (input.imagen) form.append("imagen", input.imagen)

  const res = await fetch(`${API_URL()}/admin/productos/${id}`, {
    method: "PUT",
    body: form,
  })
  if (!res.ok) {
    const json = await res.json().catch(() => null) as { message?: string } | null
    throw new Error(json?.message ?? `Error ${res.status}: ${res.statusText}`)
  }
}

export async function updateProductsStatus(
  input: UpdateProductsStatusInput
): Promise<void> {
  return apiClient.put<void>("/admin/productos/estado", input)
}
