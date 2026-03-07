export interface Ubicacion {
  calle: string
  avenida: string
  zona: string
  codigo_postal: string
}

export interface HorariosDeAtencion {
  entre_semana: string
  fines_de_semana: string
  asueto: string
}

export interface Restaurante {
  _id: string
  nombre_restaurante: string
  ubicacion: Ubicacion
  telefono: string[]
  horarios_de_atencion: HorariosDeAtencion
  esActivo: boolean
}

export interface RestauranteDetalle {
  _id: string
  nombre_restaurante: string
  ubicacion: Ubicacion
  telefono: string[]
  horarios_de_atencion: HorariosDeAtencion
  esActivo: boolean
}

export interface CreateRestauranteInput {
  nombre_restaurante: string
  ubicacion: Ubicacion
  telefono: string[]
  horarios_de_atencion: HorariosDeAtencion
}

export interface UpdateRestauranteInput {
  nombre_restaurante?: string
  ubicacion?: Partial<Ubicacion>
  telefono?: string[]
  horarios_de_atencion?: Partial<HorariosDeAtencion>
  esActivo?: boolean
}
