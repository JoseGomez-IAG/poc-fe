"use client"

import { motion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  Code,
  Lightbulb,
  Mail,
  MessageCircle,
  Monitor,
  Moon,
  Shield,
  Sparkles,
  Sun,
  Users,
  Zap
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Responses",
    description: "Get intelligent, contextual responses powered by advanced AI technology"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience real-time conversations with minimal latency"
  },
  {
    icon: BookOpen,
    title: "Template Library",
    description: "Choose from curated prompt templates for common use cases"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your conversations are protected with enterprise-grade security"
  }
]

const templates = [
  {
    icon: Mail,
    title: "Professional Email",
    description: "Craft polished emails for business communication"
  },
  {
    icon: Code,
    title: "Code Review",
    description: "Get code analysis and optimization suggestions"
  },
  {
    icon: Lightbulb,
    title: "Creative Writing",
    description: "Unlock your creativity with AI-assisted writing"
  },
  {
    icon: Users,
    title: "Problem Solving",
    description: "Brainstorm solutions for complex challenges"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation Header */}
      <motion.nav 
        className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Chat</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleTheme}
              className="gap-2"
            >
              {getThemeIcon()}
              <span className="hidden sm:inline">
                {getThemeText()}
              </span>
            </Button>
            <Button asChild>
              <Link href="/chat">
                Start Chat
              </Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="relative px-6 pt-14 pb-16 sm:px-8 sm:pt-20 sm:pb-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center rounded-full border bg-background/60 px-4 py-2 text-sm backdrop-blur-sm"
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            AI-Powered Chat Experience
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Intelligent
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}Conversations
            </span>
            <br />
            Made Simple
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl"
          >
            Experience the future of AI communication with our advanced chat platform. 
            Get intelligent responses, use curated templates, and streamline your workflow.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="group">
              <Link href="/chat">
                Start Chatting
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="h-64 w-64 rounded-full bg-primary/5 blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features"
        className="px-6 py-16 sm:px-8 sm:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="mx-auto max-w-6xl">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with modern technology and designed for productivity
            </p>
          </motion.div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative rounded-xl border bg-background/60 p-6 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Instructions Section */}
      <motion.section 
        className="px-6 py-16 sm:px-8 sm:py-24 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="mx-auto max-w-4xl">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div variants={itemVariants} className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Choose a Template</h3>
              <p className="text-muted-foreground">
                Select from our curated collection of prompt templates or start with a blank conversation
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Start Chatting</h3>
              <p className="text-muted-foreground">
                Type your message and let our AI provide intelligent, contextual responses
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Get Results</h3>
              <p className="text-muted-foreground">
                Receive high-quality responses and continue the conversation naturally
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Templates Section */}
      <motion.section 
        className="px-6 py-16 sm:px-8 sm:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="mx-auto max-w-6xl">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              Template Library
            </h2>
            <p className="text-lg text-muted-foreground">
              Jump-start your conversations with pre-built templates
            </p>
          </motion.div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((template, index) => (
              <motion.div
                key={template.title}
                variants={itemVariants}
                className="group rounded-xl border bg-background p-6 transition-all hover:shadow-md cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                  <template.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{template.title}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="px-6 py-16 sm:px-8 sm:py-24 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold sm:text-4xl mb-6">
              Ready to Transform Your Conversations?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already experiencing the power of AI-driven communication.
            </p>
            <Button asChild size="lg" className="group">
              <Link href="/chat">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Your First Chat
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
