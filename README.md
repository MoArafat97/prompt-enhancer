# Prompt Enhancer PWA

A modern, AI-powered prompt enhancement tool built with Next.js 14, TypeScript, and OpenRouter. Transform your prompts with various enhancement techniques and get results in multiple formats.

## ✨ Features

- **AI-Powered Enhancement**: Uses multiple free AI models via OpenRouter to enhance your prompts
- **Multiple Techniques**: Clarity, Chain-of-thought, Few-shot, Role-based, Creative expansion
- **Various Output Formats**: Natural language, JSON, XML
- **Progressive Web App**: Installable, offline-ready experience
- **Modern UI**: Beautiful dark theme with animations and glass-morphism effects
- **Rate Limiting**: Built-in protection against abuse
- **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenRouter API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prompt-enhancer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get your free OpenRouter API key**
   - Visit [OpenRouter.ai](https://openrouter.ai/)
   - Sign up for a free account
   - Go to the API Keys section
   - Create a new API key
   - Copy the key for the next step

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: OpenRouter (Multiple Free Models)
- **PWA**: next-pwa
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
prompt-enhancer/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API routes
│   │   └── enhance/              # Enhancement endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   ├── layout/                   # Layout components
│   ├── enhancement/              # Feature components
│   └── animations/               # Animation components
├── lib/                          # Utilities and services
│   ├── types.ts                  # TypeScript types
│   ├── constants.ts              # App constants
│   ├── utils.ts                  # Utility functions
│   ├── enhancement-service.ts    # AI service
│   └── rate-limit.ts             # Rate limiting
├── public/                       # Static assets
│   ├── icons/                    # PWA icons
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker
└── styles/                       # Additional styles
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key (free tier available) | Yes |
| `UPSTASH_REDIS_URL` | Redis URL for caching (optional) | No |
| `UPSTASH_REDIS_TOKEN` | Redis token (optional) | No |
| `NODE_ENV` | Environment (development/production) | Yes |
| `NEXT_PUBLIC_APP_URL` | App URL for metadata | No |

### Enhancement Techniques

1. **Clarity Enhancement**: Improves clarity and specificity
2. **Chain of Thought**: Adds step-by-step reasoning
3. **Few-Shot Learning**: Includes examples to guide AI
4. **Role-Based**: Defines specific roles or personas
5. **Creative Expansion**: Enhances creativity and imagination

### Output Formats

- **Natural Language**: Human-readable enhanced prompt
- **JSON**: Structured JSON format
- **XML**: XML tagged format

### Available Free AI Models

The application uses OpenRouter to access multiple free AI models:

1. **Llama 3.1 8B Instruct** (Default) - Meta's fast and capable model
2. **Phi-3 Mini 128K** - Microsoft's compact model with large context
3. **Gemma 2 9B IT** - Google's efficient instruction-tuned model
4. **Mistral 7B Instruct** - High-quality open-source model
5. **Zephyr 7B Beta** - Hugging Face's conversation-optimized model

All models are completely free to use through OpenRouter's free tier!

## 🔧 Troubleshooting

### Model Not Available Error

If you get a "No endpoints found" error, try these steps:

1. **Test your models**: Visit `/api/test-models` or use the "Test Models" button in the app
2. **Run the test script**: `node scripts/test-openrouter.js`
3. **Check your API key**: Make sure `OPENROUTER_API_KEY` is set in `.env.local`
4. **Verify model IDs**: Model availability can change; the app will automatically fallback to working models

### Common Issues

- **401 Unauthorized**: Check your OpenRouter API key
- **404 Model Not Found**: The model may be temporarily unavailable; the app will try alternative models
- **Rate Limiting**: OpenRouter has generous limits, but wait a moment if you hit them
- **No Response**: Some models may be overloaded; the app will automatically retry with different models

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security

- Rate limiting to prevent abuse
- Input validation and sanitization
- Environment variable protection
- CORS configuration
- Content Security Policy headers

## 🎨 Customization

### Themes

The app uses a dark theme by default. Colors can be customized in:
- `tailwind.config.js` - Tailwind configuration
- `app/globals.css` - CSS custom properties

### Enhancement Techniques

Add new techniques by:
1. Adding to `ENHANCEMENT_TECHNIQUES` in `lib/constants.ts`
2. Adding system prompt in `SYSTEM_PROMPTS`
3. Updating TypeScript types in `lib/types.ts`

## 📱 PWA Features

- **Installable**: Can be installed on desktop and mobile
- **Offline Support**: Basic offline functionality
- **App-like Experience**: Standalone display mode
- **Push Notifications**: Ready for implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🙏 Acknowledgments

- OpenRouter for providing access to free AI models
- Vercel for hosting and deployment
- The Next.js team for the amazing framework
- All contributors and users of this project
