"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@myapp/ui/components/tabs";
import { Alert, AlertDescription } from "@myapp/ui/components/alert";
import { Button } from "@myapp/ui/components/button";
import { AlertCircle, MessageSquare, Plus } from "lucide-react";
import { TicketSubmitForm } from "./components/TicketSubmitForm";
import { PublicTicketList } from "./components/PublicTicketList";
import { CategoryFilter } from "./components/CategoryFilter";
import { trpc } from "@/utils/trpc/client";

export function CommunityPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTicketSubmitted = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            민원 커뮤니티
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            시민 여러분의 목소리를 직접 전달하고, 다른 시민들과 소통하는 공간입니다
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            이곳에 접수된 민원은 공개적으로 게시되며, 다른 시민들이 열람할 수 있습니다.
            개인정보는 자동으로 마스킹 처리됩니다.
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        {!showForm && (
          <div className="mb-6 flex justify-center">
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              새 민원 접수하기
            </Button>
          </div>
        )}

        {/* Submit Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>민원 접수</CardTitle>
              <CardDescription>
                아래 양식을 작성하여 민원을 접수해주세요. * 표시는 필수 항목입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TicketSubmitForm
                onSuccess={handleTicketSubmitted}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="recent" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="recent">최근 민원</TabsTrigger>
              <TabsTrigger value="popular">인기 민원</TabsTrigger>
              <TabsTrigger value="replied">답변 완료</TabsTrigger>
            </TabsList>
            <CategoryFilter
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          <TabsContent value="recent" className="space-y-4">
            <PublicTicketList
              type="recent"
              category={selectedCategory}
              refreshKey={refreshKey}
            />
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <PublicTicketList
              type="popular"
              category={selectedCategory}
              refreshKey={refreshKey}
            />
          </TabsContent>

          <TabsContent value="replied" className="space-y-4">
            <PublicTicketList
              type="replied"
              category={selectedCategory}
              refreshKey={refreshKey}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
