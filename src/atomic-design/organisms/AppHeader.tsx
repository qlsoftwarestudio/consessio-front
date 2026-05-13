import { Bell, LogOut, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/atomic-design/atoms/Avatar";
import { useAppStore } from "@/shared/store/app-store";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/domain";
import { env } from "@/shared/config/env";
import { authService } from "@/features/auth/api/auth.service";
import { useSearchStore } from "@/shared/store/search-store";
import { useEffect } from "react";

const ApiModeChip = () => {
  if (!env.useMockApi) return null;
  return (
    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning ring-1 ring-warning/30">
      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
      Modo demo
    </span>
  );
};

export const AppHeader = () => {
  const user = useAppStore((s) => s.user);
  const org = useAppStore((s) => s.organization);
  const signOut = useAppStore((s) => s.signOut);
  const navigate = useNavigate();
  const location = useLocation();
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const clear = useSearchStore((s) => s.clear);

  // Limpiar al cambiar de sección para evitar arrastrar búsquedas entre páginas
  useEffect(() => {
    clear();
  }, [location.pathname, clear]);

  const placeholder = (() => {
    if (location.pathname.startsWith("/app/vehiculos")) return "Buscar marca o modelo…";
    if (location.pathname.startsWith("/app/cotizaciones")) return "Buscar cotizaciones…";
    if (location.pathname.startsWith("/app/leads")) return "Buscar leads por nombre, teléfono o email…";
    return "Buscar leads, vehículos…";
  })();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Si el usuario escribe desde el dashboard u otra ruta, lo llevamos a leads.
    if (
      !location.pathname.startsWith("/app/leads") &&
      !location.pathname.startsWith("/app/vehiculos") &&
      !location.pathname.startsWith("/app/cotizaciones")
    ) {
      navigate(ROUTES.leads);
    }
  };

  const handleSignOut = () => {
    authService.signOut();
    signOut();
    navigate(ROUTES.login);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/70 px-3 backdrop-blur-xl sm:px-5">
      <SidebarTrigger className="-ml-1" />

      <form onSubmit={onSubmit} className="hidden flex-1 max-w-md md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="border-border/60 bg-surface-1/60 pl-9 focus-visible:ring-primary/40"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2">
        <ApiModeChip />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-surface-2">
              <Avatar name={user?.fullName ?? "?"} size="sm" />
              <span className="hidden text-sm font-medium sm:block">{user?.fullName}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{user?.fullName}</div>
              <div className="text-xs font-normal text-muted-foreground">{user?.email}</div>
              <div className="mt-1.5 text-[11px] uppercase tracking-wider text-primary">{org?.name}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
