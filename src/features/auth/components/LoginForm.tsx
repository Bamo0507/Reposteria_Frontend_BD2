"use client";

import { useState } from "react";
import { IconCake, IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLogin } from "@/features/auth/hooks/useLogin";

export function LoginForm() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ user?: string; password?: string }>({});

  const mutation = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { user?: string; password?: string } = {};

    if (!user) {
      newErrors.user = "El usuario es requerido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate({ nombre_usuario: user, contrasenia: password });
  };

  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #72d5d4 100%)",
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 border-2 border-primary">
                <IconCake className="size-10 text-primary" stroke={2.0} />
              </div>
              <h1 className="text-5xl font-extrabold text-foreground">SWEET LAB</h1>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardContent className="px-8 py-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="user" className="font-semibold">Usuario</Label>
                  <Input
                    id="user"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className={errors.user ? "border-destructive" : ""}
                  />
                  {errors.user && (
                    <p className="text-sm text-destructive">{errors.user}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-semibold">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={errors.password ? "border-destructive" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <IconEyeOff className="h-4 w-4" />
                      ) : (
                        <IconEye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full font-bold shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-l-lg"
                    disabled={mutation.isPending}
                  >
                    <p className="py-4 text-white">
                      {mutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </p>
                  </Button>
                </div>

                {mutation.isError && (
                  <p className="text-sm text-destructive text-center font-semibold pt-2">
                    Usuario o contraseña incorrectos
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}