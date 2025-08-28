"use client";

import { useTranslations } from "next-intl";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@myapp/ui/components/card";
import { Label } from "@myapp/ui/components/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@myapp/ui/components/select";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SettingsPage() {
  const t = useTranslations("SettingsPage");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [current, setCurrent] = useState<string | undefined>(theme);

  useEffect(() => {
    setCurrent(theme);
  }, [theme]);

  return (
    <DashboardLayout>
      <PageHeader title={t("title")} description={t("description")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("appearance.title")}</CardTitle>
          <CardDescription>{t("appearance.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:max-w-xs">
            <Label htmlFor="theme-select">{t("appearance.theme")}</Label>
            <Select
              value={current}
              onValueChange={(value) => {
                setCurrent(value);
                setTheme(value);
              }}
            >
              <SelectTrigger id="theme-select">
                <SelectValue placeholder={t("appearance.selectPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t("appearance.light")}</SelectItem>
                <SelectItem value="dark">{t("appearance.dark")}</SelectItem>
                <SelectItem value="system">{t("appearance.system")}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t("appearance.current", { value: resolvedTheme || "system" })}
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
