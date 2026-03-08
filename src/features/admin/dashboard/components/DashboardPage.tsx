export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard
          </h1>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Visualiza las métricas y el rendimiento general de la repostería
          </p>
          <p className="text-sm text-muted-foreground sm:hidden">
            Visualiza las métricas principales
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-[#ffffff] shadow-[0_2px_10px_0_rgba(70,76,79,0.2)]">
        <iframe
          title="Dashboard de MongoDB Charts"
          className="h-[100vh] w-full border-0"
          src="https://charts.mongodb.com/charts-project-0-bzsgzcj/embed/dashboards?id=cc01c81c-440c-4a2c-95c7-b914f20f91f7&theme=light&autoRefresh=true&maxDataAge=14400&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=fixed"
        />
      </div>
    </div>
  );
}
