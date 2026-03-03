"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  IconUser,
  IconLogout,
  IconLayoutDashboard,
  IconMessageStar,
  IconPackage,
  IconBuildingStore,
  IconClipboardList,
} from "@tabler/icons-react"
import { useLogout } from "@/hooks/use-logout"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type MenuItem = {
  title: string
  url: string
  icon: React.ElementType
}

const adminMenuItems: MenuItem[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: IconLayoutDashboard },
  { title: "Reseñas", url: "/admin/resenias", icon: IconMessageStar },
  { title: "Productos", url: "/admin/productos", icon: IconPackage },
  { title: "Restaurantes", url: "/admin/restaurantes", icon: IconBuildingStore },
  { title: "Pedidos", url: "/admin/pedidos", icon: IconClipboardList },
]

const clientMenuItems: MenuItem[] = [
  { title: "Pedidos", url: "/client/pedidos", icon: IconClipboardList },
  { title: "Reseñas", url: "/client/resenias", icon: IconMessageStar },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const logout = useLogout()
  const [username, setUsername] = useState("")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    const nombre = localStorage.getItem("nombre_usuario") ?? ""
    const tipo = localStorage.getItem("tipo_usuario") ?? ""
    setUsername(nombre)
    setMenuItems(tipo === "admin" ? adminMenuItems : clientMenuItems)
  }, [])

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="p-0 group-data-[collapsible=icon]:py-2! border-r border-b-black border-8"
      {...props}
    >
      <SidebarHeader>
        {/* Expanded: SWEET LAB */}
        <div className="group-data-[collapsible=icon]:hidden flex w-full items-center justify-center px-2 py-2">
          <span className="text-xl font-extrabold tracking-wide text-foreground">SWEET LAB</span>
        </div>
        {/* Collapsed: SL */}
        <div className="hidden group-data-[collapsible=icon]:flex w-full items-center justify-center px-0">
          <div className="flex items-center justify-center size-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <span className="font-semibold text-xs">SL</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:px-0">
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                  <SidebarMenuButton
                    asChild
                    className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0!"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center group-data-[collapsible=icon]:justify-center"
                    >
                      <item.icon className="group-data-[collapsible=icon]:mx-auto" />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:px-0">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="group cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0! hover:bg-sidebar-accent/80 focus-visible:ring-2"
                  aria-label="Abrir menú de usuario"
                >
                  <div className="flex items-center justify-center size-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:mx-auto">
                    <IconUser className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-md mx-1 leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-bold">{username}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" side="top" className="bg-sidebar">
                <DropdownMenuItem
                  className="text-destructive focus:cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault()
                    logout()
                  }}
                >
                  <IconLogout className="mr-2 size-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}