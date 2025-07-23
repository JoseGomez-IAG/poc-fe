"use client"

import { ArrowLeft, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Chat } from "@/components/ui/chat"
import { type Message } from "@/components/ui/chat-message"

// Chat templates/suggestions
const CHAT_SUGGESTIONS = [
  "Help me write a professional email",
  "Explain a complex topic simply", 
  "Code review and optimization",
  "Creative writing assistance",
  "Problem-solving brainstorm",
  "Technical documentation help"
]

// API base URL - using localhost:5001 as specified
const API_BASE_URL = "http://localhost:5001"

interface ChatResponse {
  message: string
  id: string
  timestamp: number
}

interface ChatError {
  error: string
  code?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle form submission
  const handleSubmit = useCallback(async (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => {
    event?.preventDefault?.()
    
    if (!input.trim() || isGenerating) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)

    try {
      // Create assistant message placeholder
      const assistantId = `assistant-${Date.now()}`
      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant", 
        content: "",
        createdAt: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      // Make API call to localhost:5001/chat
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          conversation_id: `chat-${Date.now()}`, // Simple conversation ID
          attachments: options?.experimental_attachments ? Array.from(options.experimental_attachments).map(f => f.name) : undefined
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ChatResponse = await response.json()

      // Update the assistant message with the response
      setMessages(prev => prev.map(msg => 
        msg.id === assistantId 
          ? { ...msg, content: data.message || "I apologize, but I couldn't generate a response. Please try again." }
          : msg
      ))

      toast.success("Response generated successfully!")

    } catch (error) {
      console.error("Chat API error:", error)
      
      // Update assistant message with error
      setMessages(prev => prev.map(msg => 
        msg.id.startsWith('assistant-') && msg.content === ""
          ? { 
              ...msg, 
              content: "I'm sorry, I'm having trouble connecting to the chat service. Please check that the backend is running on localhost:5001 and try again." 
            }
          : msg
      ))

      toast.error("Failed to get response. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }, [input, isGenerating])

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  // Handle suggestion clicks
  const handleSuggestionClick = useCallback((message: { role: "user"; content: string }) => {
    setInput(message.content)
  }, [])

  // Handle message rating (optional feature)
  const handleRateResponse = useCallback((messageId: string, rating: "thumbs-up" | "thumbs-down") => {
    toast.success(`Feedback recorded: ${rating}`)
    console.log(`Message ${messageId} rated: ${rating}`)
  }, [])

  // Theme cycle function
  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="h-4 w-4" />
    
    switch (theme) {
      case "light": return <Sun className="h-4 w-4" />
      case "dark": return <Moon className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }

  const getThemeText = () => {
    if (!mounted) return "Theme"
    
    switch (theme) {
      case "light": return "Light"
      case "dark": return "Dark"
      case "system": return "System"
      default: return "Theme"
    }
  }

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
          <Chat
            messages={messages}
            handleSubmit={handleSubmit}
            input={input}
            handleInputChange={handleInputChange}
            isGenerating={isGenerating}
            append={handleSuggestionClick}
            suggestions={CHAT_SUGGESTIONS}
            onRateResponse={handleRateResponse}
            setMessages={setMessages}
            className="h-full"
          />
        </div>
      </main>

      {/* Connection Status Footer */}
      <footer className="border-t bg-muted/30 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Connected to chat service</span>
          </div>
          <div className="text-xs">
            Backend: {API_BASE_URL}/chat
          </div>
        </div>
      </footer>
    </div>
  )
} 