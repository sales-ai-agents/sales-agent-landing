"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Send, Bot, Loader2 } from "lucide-react";

import {
  Button,
  Textarea,
  Message,
  MessageAvatar,
  MessageContent,
  Bubble,
  BubbleContent,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { SUPPORT_BOT_WELCOME_MESSAGE, SUPPORT_BOT_SUGGESTIONS } from "@/lib/support-bot-config";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface SupportBotChatProps {
  onClose: () => void;
}

const SUPPORT_CHAT_URL = "/api/app/support-chat";

export const SupportBotChat = ({ onClose }: SupportBotChatProps) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      abortRef.current = new AbortController();

      const response = await fetch(SUPPORT_CHAT_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg
          )
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: "Вибачте, сталася помилка. Спробуйте ще раз." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const target = event.target as HTMLElement;
    const anchor = target.closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href?.startsWith("/")) return;

    event.preventDefault();
    router.push(href);
    onClose();
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="bg-background fixed right-6 bottom-32 z-50 flex h-130 w-95 flex-col overflow-hidden rounded-2xl border shadow-2xl">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
            <Bot className="text-primary-foreground h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">AI Помічник</p>
            <p className="text-muted-foreground text-xs">Онлайн</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Закрити чат</span>
        </Button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4" onClick={handleLinkClick}>
        <WelcomeMessage />

        {messages.length === 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SUPPORT_BOT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="bg-muted/50 hover:bg-muted rounded-lg border px-3 py-1.5 text-xs transition-colors"
                onClick={() => sendMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} role={message.role} content={message.content} />
          ))}

          {isLoading && messages.at(-1)?.content === "" && (
            <Message align="start">
              <MessageAvatar>
                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                  <Bot className="text-primary-foreground h-4 w-4" />
                </div>
              </MessageAvatar>
              <MessageContent>
                <Bubble variant="secondary">
                  <BubbleContent>
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  </BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишіть повідомлення..."
            className="max-h-24 min-h-10 flex-1 resize-none text-sm"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Надіслати</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

const WelcomeMessage = () => {
  return (
    <Message align="start">
      <MessageAvatar>
        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
          <Bot className="text-primary-foreground h-4 w-4" />
        </div>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant="secondary">
          <BubbleContent>
            <p className="text-sm">{SUPPORT_BOT_WELCOME_MESSAGE}</p>
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
};

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

const ChatBubble = ({ role, content }: ChatBubbleProps) => {
  const isUser = role === "user";

  if (!content) return null;

  return (
    <Message align={isUser ? "end" : "start"}>
      {!isUser && (
        <MessageAvatar>
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
            <Bot className="text-primary-foreground h-4 w-4" />
          </div>
        </MessageAvatar>
      )}
      <MessageContent>
        <Bubble variant={isUser ? "default" : "secondary"} align={isUser ? "end" : "start"}>
          <BubbleContent>
            {isUser ? (
              <p className="text-sm">{content}</p>
            ) : (
              <div
                className={cn(
                  "prose prose-sm dark:prose-invert max-w-none",
                  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
                )}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
              />
            )}
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
};

const formatMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/((?:<li>[^]*?<\/li>\s*)+)/g, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");
};
