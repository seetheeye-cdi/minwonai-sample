"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Sparkles, RefreshCw, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@myapp/ui/components/button";
import { Card } from "@myapp/ui/components/card";
import { Textarea } from "@myapp/ui/components/textarea";
import { Label } from "@myapp/ui/components/label";
import { Badge } from "@myapp/ui/components/badge";
import { Alert, AlertDescription } from "@myapp/ui/components/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@myapp/ui/components/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@myapp/ui/components/tabs";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc/client";
import type { TicketStatus } from "@myapp/prisma";

interface Ticket {
  id: string;
  status: TicketStatus;
  content: string;
  citizenName: string;
  category: string | null;
  aiDraftAnswer: string | null;
  aiNeedsManualReview: boolean | null;
  aiErrorMessage: string | null;
}

interface ReplyPanelProps {
  ticket: Ticket;
  onReplySuccess?: () => void;
}

type ToneType = "formal" | "friendly" | "empathetic" | "direct";

const TONE_PROMPTS: Record<ToneType, string> = {
  formal: "공식적이고 정중한 어조로 작성해주세요.",
  friendly: "친근하고 따뜻한 어조로 작성해주세요.",
  empathetic: "공감하고 이해하는 어조로 작성해주세요.",
  direct: "간결하고 명확한 어조로 작성해주세요.",
};

export function ReplyPanel({ ticket, onReplySuccess }: ReplyPanelProps) {
  const t = useTranslations("ReplyPanel");
  const [replyText, setReplyText] = useState(ticket.aiDraftAnswer || "");
  const [selectedTone, setSelectedTone] = useState<ToneType>("formal");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const sendReplyMutation = trpc.ticket.sendReply.useMutation({
    onSuccess: () => {
      toast.success(t("sendSuccess"));
      setReplyText("");
      onReplySuccess?.();
    },
    onError: (error) => {
      toast.error(t("sendError", { error: error.message }));
    },
  });

  const generateAIDraftMutation = trpc.ticket.generateAIDraft.useMutation({
    onSuccess: (data) => {
      setReplyText(data.draft);
      toast.success(t("generateSuccess"));
    },
    onError: (error) => {
      toast.error(t("generateError", { error: error.message }));
    },
  });

  const handleGenerateAIDraft = async () => {
    setIsGenerating(true);
    try {
      await generateAIDraftMutation.mutateAsync({
        ticketId: ticket.id,
        tone: selectedTone,
        additionalPrompt: TONE_PROMPTS[selectedTone],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast.error(t("emptyReplyError"));
      return;
    }
    
    sendReplyMutation.mutate({
      ticketId: ticket.id,
      replyText: replyText.trim(),
    });
  };

  const canReply = ticket.status !== "CLOSED" && ticket.status !== "REPLIED";

  return (
    <Card className="sticky top-6">
      <div className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        
        {/* AI Error Alert */}
        {ticket.aiNeedsManualReview && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("aiError")}: {ticket.aiErrorMessage || t("unknownError")}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="draft" className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draft">{t("tabs.draft")}</TabsTrigger>
            <TabsTrigger value="templates">{t("tabs.templates")}</TabsTrigger>
          </TabsList>

          <TabsContent value="draft" className="space-y-6">
            {/* Tone Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("tone.label")}</Label>
              <Select
                value={selectedTone}
                onValueChange={(value) => setSelectedTone(value as ToneType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">{t("tone.formal")}</SelectItem>
                  <SelectItem value="friendly">{t("tone.friendly")}</SelectItem>
                  <SelectItem value="empathetic">{t("tone.empathetic")}</SelectItem>
                  <SelectItem value="direct">{t("tone.direct")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate AI Draft Button */}
            <Button
              onClick={handleGenerateAIDraft}
              disabled={!canReply || isGenerating || generateAIDraftMutation.isPending}
              className="w-full"
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {t("generating")}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t("generateDraft")}
                </>
              )}
            </Button>

            {/* Reply Text Editor */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("replyText.label")}</Label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t("replyText.placeholder")}
                className="min-h-[200px]"
                disabled={!canReply}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {t("replyText.hint")}
              </p>
            </div>

            {/* Character Count */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t("characterCount", { count: replyText.length })}</span>
              {replyText.length > 500 && (
                <span className="text-warning">{t("longReply")}</span>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setReplyText(t("templates.receipt"))}
                disabled={!canReply}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("templates.receiptTitle")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setReplyText(t("templates.inProgress"))}
                disabled={!canReply}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("templates.inProgressTitle")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setReplyText(t("templates.needMoreInfo"))}
                disabled={!canReply}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("templates.needMoreInfoTitle")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setReplyText(t("templates.resolved"))}
                disabled={!canReply}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("templates.resolvedTitle")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Send Button */}
        <Button
          onClick={handleSendReply}
          disabled={!canReply || !replyText.trim() || sendReplyMutation.isPending}
          className="w-full"
        >
          {sendReplyMutation.isPending ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t("sending")}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t("sendReply")}
            </>
          )}
        </Button>

        {/* Status Info */}
        {!canReply && (
          <Alert>
            <AlertDescription>
              {ticket.status === "CLOSED" && t("closedTicket")}
              {ticket.status === "REPLIED" && t("alreadyReplied")}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}
