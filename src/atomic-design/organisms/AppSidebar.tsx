import { Calendar, Car, FileText, LayoutDashboard, Users, UsersRound } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Logo } from "@/atomic-design/atoms/Logo";
import { ROUTES } from "@/shared/constants/domain";
import { useAppStore } from "@/shared/store/app-store";
import { Avatar } from "@/atomic-design/atoms/Avatar";
import { useAuth } from "@/shared/auth/useAuth";
import { ROLE_LABEL, ROLE_TONE } from "@/shared/auth/roles";

const items = [
  { title: "Dashboard", url: ROUTES.dashboard, icon: LayoutDashboard, end: true },
  { title: "Leads", url: ROUTES.leads, icon: Users },
  { title: "Vehículos", url: ROUTES.vehicles, icon: Car },
  { title: "Cotizaciones", url: ROUTES.quotations, icon: FileText },
  { title: "Test drives", url: ROUTES.testDrives, icon: Calendar },
];

const adminItems = [
  { title: "Usuarios", url: ROUTES.members, icon: UsersRound, cap: "viewUsers" as const },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const user = useAppStore((s) => s.user);
  const { role, can } = useAuth();
  const visibleAdminItems = adminItems.filter((it) => can(it.cap));

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        {collapsed ? <Logo showText={false} size="sm" /> : <Logo size="sm" />}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">Operación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url, item.end)}
                    className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <NavLink to={item.url} end={item.end}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {visibleAdminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider">Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleAdminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {user && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar name={user.fullName} size="sm" />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{user.fullName}</p>
                <span
                  className={`mt-0.5 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ring-inset ${ROLE_TONE[role]}`}
                >
                  {ROLE_LABEL[role]}
                </span>
              </div>
            )}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
