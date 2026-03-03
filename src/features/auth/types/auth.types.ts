export type LoginRequest = {
  nombre_usuario: string;
  contrasenia: string;
};

export type LoginResponse = {
  _id: string;
  nombre_usuario: string;
  tipo_usuario: string;
};