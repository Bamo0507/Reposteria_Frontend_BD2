"use client"

interface StatusBadgeProps {
  active: boolean
}

export function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active
          ? "bg-green-500/10 text-green-700 dark:text-green-400"
          : "bg-red-500/10 text-red-700 dark:text-red-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"
        }`}
      />
      {active ? "Activo" : "Inactivo"}
    </span>
  )
}
