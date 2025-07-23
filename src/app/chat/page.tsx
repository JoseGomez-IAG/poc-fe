"use client";

import { ArrowLeft, Loader2, Monitor, Moon, Send, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { type Message } from "@/components/ui/chat-message";
import { WorkOrderCards } from "@/components/ui/work-order-card";

// Chat templates/suggestions
const CHAT_SUGGESTIONS = [
  "Find work orders similar to engine vibration",
  "Show me AMM 72-21 related cases",
  "Search for landing gear hydraulic leaks",
  "Find work orders with high ground time",
  "Show part number PN-12345 usage",
  "Find similar maintenance patterns",
];

// API base URL - using localhost:5001 as specified
const API_BASE_URL = "http://localhost:5001";

interface StreamToken {
  token: string;
  done: boolean;
}

interface CardData {
  type: "cards";
  data: {
    query: string;
    total_found: number;
    avg_similarity: number;
    work_orders: any[];
  };
  done: boolean;
}

// Extended message type to support cards
interface ExtendedMessage extends Message {
  cardData?: CardData["data"];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (
      event?: { preventDefault?: () => void },
      options?: { experimental_attachments?: FileList }
    ) => {
      event?.preventDefault?.();

      if (!input.trim() || isGenerating) return;

      const userMessage: ExtendedMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: input.trim(),
        createdAt: new Date(),
      };

      // Add user message immediately
      setMessages((prev) => [...prev, userMessage]);
      const currentInput = input.trim();
      setInput("");
      setIsGenerating(true);

      try {
        // Create assistant message placeholder
        const assistantId = `assistant-${Date.now()}`;
        const assistantMessage: ExtendedMessage = {
          id: assistantId,
          role: "assistant",
          content: "",
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Make streaming API call to localhost:5001/chat
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            message: currentInput,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body received");
        }

        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            // Decode the chunk and add to buffer
            buffer += decoder.decode(value, { stream: true });

            // Process complete lines from buffer
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.trim() === "") continue;

              // Parse Server-Sent Events format
              if (line.startsWith("data: ")) {
                try {
                  const jsonStr = line.slice(6); // Remove 'data: ' prefix
                  const data = JSON.parse(jsonStr);

                  // Check if this is card data
                  if (data.type === "cards") {
                    const cardData = data as CardData;
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantId
                          ? {
                              ...msg,
                              content: "Work Order Search Results",
                              cardData: cardData.data,
                            }
                          : msg
                      )
                    );

                    if (cardData.done) {
                      toast.success("Search results loaded!");
                      setIsGenerating(false);
                      return;
                    }
                  } else {
                    // Regular streaming token
                    const tokenData = data as StreamToken;

                    // Update the assistant message with the new token
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantId
                          ? {
                              ...msg,
                              content: msg.content + tokenData.token,
                            }
                          : msg
                      )
                    );

                    // If this is the final token, we're done
                    if (tokenData.done) {
                      toast.success("Response generated successfully!");
                      setIsGenerating(false);
                      return;
                    }
                  }
                } catch (parseError) {
                  console.error(
                    "Error parsing SSE data:",
                    parseError,
                    "Line:",
                    line
                  );
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        // If we get here without the done flag, something went wrong
        if (isGenerating) {
          toast.success("Response completed!");
        }
      } catch (error) {
        console.error("Chat API error:", error);

        // Update assistant message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id.startsWith("assistant-") && msg.content === ""
              ? {
                  ...msg,
                  content:
                    "I'm sorry, I'm having trouble connecting to the chat service. Please check that the backend is running on localhost:5001 and try again.",
                }
              : msg
          )
        );

        toast.error("Failed to get response. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    },
    [input, isGenerating]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  // Theme cycle function
  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="h-4 w-4" />;

    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeText = () => {
    if (!mounted) return "Theme";

    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "Theme";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold">AI Chat</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleTheme}
              className="gap-2"
            >
              {getThemeIcon()}
              {getThemeText()}
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">
        <div className="h-[calc(100vh-12rem)] w-full">
          <div className="grid max-h-full w-full grid-rows-[1fr_auto] h-full">
            {/* Messages Area */}
            <div className="grid grid-cols-1 overflow-y-auto pb-4">
              <div className="max-w-full space-y-4">
                {messages.map((message, index) => {
                  if (message.role === "user") {
                    return (
                      <div key={index} className="flex flex-col items-end">
                        <div className="bg-primary text-primary-foreground rounded-lg p-3 text-sm max-w-[70%] break-words">
                          {message.content}
                        </div>
                        {message.createdAt && (
                          <time className="mt-1 block px-1 text-xs opacity-50">
                            {message.createdAt.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        )}
                      </div>
                    );
                  }

                  // Assistant message
                  return (
                    <div key={index} className="flex flex-col items-start">
                      {message.cardData ? (
                        // Render work order cards
                        <div className="w-full max-w-full">
                          <WorkOrderCards data={message.cardData} />
                        </div>
                      ) : (
                        // Render regular text message
                        <div className="bg-muted text-foreground rounded-lg p-3 text-sm max-w-[70%] break-words">
                          {message.content}
                        </div>
                      )}
                      {message.createdAt && (
                        <time className="mt-1 block px-1 text-xs opacity-50">
                          {message.createdAt.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      )}
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isGenerating && (
                  <div className="flex flex-col items-start">
                    <div className="bg-muted text-foreground rounded-lg p-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="mt-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Suggestions */}
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">
                      Try these work order searches ✨
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {CHAT_SUGGESTIONS.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setInput(suggestion)}
                          className="text-left p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="flex gap-2 relative">
                  <textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about work orders, AMM references, part numbers..."
                    disabled={isGenerating}
                    className="flex-1 min-h-[44px] max-h-32 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isGenerating}
                    size="icon"
                    className="absolute right-3 top-3"
                  >
                    {isGenerating ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Send className="size-5" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Connection Status Footer */}
      <footer className="border-t bg-muted/30 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${isGenerating ? "bg-yellow-500" : "bg-green-500"}`}
            />
            <span>
              {isGenerating
                ? "Generating response..."
                : "Connected to chat service"}
            </span>
          </div>
          <div className="text-xs">
            Backend: {API_BASE_URL}/chat (Streaming)
          </div>
        </div>
      </footer>
    </div>
  );
}
