# AI Chat Application

A modern, responsive chat application built with Next.js 15, React 19, TypeScript, and ShadCN UI components.

## Features

- 🎨 **Modern UI**: Built with ShadCN UI components and Tailwind CSS
- 🌙 **Theme Support**: Light, dark, and system theme modes
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- ⚡ **Fast Performance**: Powered by Next.js 15 with Turbopack
- 🤖 **AI Integration**: Connect to your backend AI service at localhost:5001
- 🎯 **Template Library**: Pre-built prompt templates for common use cases
- ✨ **Smooth Animations**: Framer Motion animations for enhanced UX
- 🔧 **TypeScript**: Full type safety throughout the application

## Pages

### 1. Landing Page (`/`)
- Modern hero section with gradient backgrounds
- Feature highlights with animated cards
- Step-by-step instructions
- Template library showcase
- Call-to-action buttons
- Theme toggle in navigation

### 2. Chat Interface (`/chat`)
- Real-time chat interface using existing UI components
- Message input with attachment support
- Template suggestions for quick start
- Typing indicators and loading states
- Message rating system (thumbs up/down)
- Error handling and connection status
- Theme toggle and navigation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, ShadCN UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Themes**: next-themes
- **Notifications**: Sonner
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended)
- Backend API running on localhost:5001 (optional for full functionality)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Backend Integration

The chat interface connects to a backend API at `http://localhost:5001/chat`. 

Expected API format:
```typescript
// POST /chat
{
  "message": "Your message here",
  "conversation_id": "unique-conversation-id",
  "attachments": ["file1.txt", "file2.pdf"] // optional
}

// Response
{
  "message": "AI response here",
  "id": "message-id",
  "timestamp": 1234567890
}
```

## Project Structure

```
src/
├── app/
│   ├── chat/
│   │   └── page.tsx          # Chat interface page
│   ├── globals.css           # Global styles and CSS variables
│   ├── layout.tsx            # Root layout with theme provider
│   └── page.tsx              # Landing page
├── components/
│   └── ui/                   # ShadCN UI components
│       ├── button.tsx        # Button component
│       ├── chat.tsx          # Main chat container
│       ├── chat-message.tsx  # Message component
│       ├── message-input.tsx # Input component
│       ├── message-list.tsx  # Message list
│       ├── prompt-suggestions.tsx # Template suggestions
│       ├── sonner.tsx        # Toast notifications
│       └── ... (other components)
├── hooks/                    # Custom React hooks
├── lib/
│   └── utils.ts             # Utility functions
└── types/                   # TypeScript type definitions
```

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors

## Chat Templates

The application includes 6 pre-built templates:

1. **Professional Email** - Craft polished business emails
2. **Explain Complex Topics** - Simplify complex concepts
3. **Code Review** - Get code analysis and optimization
4. **Creative Writing** - AI-assisted creative content
5. **Problem Solving** - Brainstorm solutions
6. **Technical Documentation** - Help with documentation

## Theme System

Three theme modes available:
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Dark interface for low-light environments  
- **System Mode**: Automatically matches system preferences

## Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet-friendly**: Smooth experience on tablets
- **Desktop-enhanced**: Full feature set on larger screens

## Error Handling

- **API Errors**: Graceful error messages and retry options
- **Network Issues**: Connection status indicators
- **Loading States**: Proper loading indicators during API calls
- **Type Safety**: TypeScript prevents runtime errors

## Performance Features

- **Lazy Loading**: Components load when needed
- **Optimized Re-renders**: Minimal unnecessary updates
- **Efficient Animations**: GPU-accelerated animations
- **Code Splitting**: Automatic code splitting with Next.js

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper accessibility labels
- **Color Contrast**: WCAG-compliant color ratios
- **Screen Reader**: Compatible with screen readers

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.
