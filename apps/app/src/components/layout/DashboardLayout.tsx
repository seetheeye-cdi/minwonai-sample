"use client";

import { type ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@myapp/ui/components/sidebar";
import { Input } from "@myapp/ui/components/input";
import { Separator } from "@myapp/ui/components/separator";
import {
  Home,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { SignedIn } from "@/components/clerk/SignedIn";
import { UserButton } from "@/components/clerk/UserButton";
import { Link } from "@/i18n/navigation";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const tLayout = useTranslations("DashboardLayout");

  const navItems: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
  }> = [
    { label: tLayout("nav.overview"), icon: Home, href: "/" },
    { label: tLayout("nav.analytics"), icon: BarChart3, href: "#" },
    { label: tLayout("nav.customers"), icon: Users, href: "#" },
    { label: tLayout("nav.billing"), icon: CreditCard, href: "/subscription" },
    { label: tLayout("nav.settings"), icon: Settings, href: "/settings" },
    { label: tLayout("nav.support"), icon: HelpCircle, href: "#" },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="px-2 py-1.5">
            <div className="text-sm font-semibold">MyApp</div>
            <div className="text-xs text-muted-foreground">SaaS Dashboard</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{tLayout("group.main")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item, idx) => (
                  <SidebarMenuItem key={idx}>
                    <SidebarMenuButton asChild>
                      {item.href.startsWith("/") ? (
                        <Link href={item.href} aria-label={item.label}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <a href={item.href} aria-label={item.label}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </a>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <div className="px-2 text-xs text-muted-foreground">v1.0.0</div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        {/* TopBar */}
        <div className="flex gap-2 items-center px-4 h-14 border-b">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-1 h-6" />
          <div className="flex gap-2 items-center ml-auto">
            <div className="hidden sm:block">
              <Input
                placeholder={tLayout("topbar.searchPlaceholder")}
                className="w-56"
              />
            </div>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
