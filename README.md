# AI-Powered Document Assistant

An intelligent document creation and refinement platform powered by Dust AI agents. This application helps you generate, edit, and improve documents through AI-assisted planning, quick analysis, and iterative refinement built with Loveable, Dust(for Amaazing AI Agents) and Open AI GPT 5 models.

## 🌟 Features

- **Smart Document Planning**: Generate comprehensive document outlines and execution plans using AI planning agents
- **Multi-Agent System**: Three specialized AI agents for different use cases:
  - **Planning Agent**: Creates detailed document structures and outlines
  - **Short Ask Agent**: Quick questions and rapid analysis
  - **Generic Agent**: Flexible general-purpose document assistance
- **Interactive Document Editor**: Real-time editing with AI-powered refinement suggestions
- **Agent Chat Interface**: Ask questions and get contextual help from AI agents
- **Apply & Iterate**: Append AI responses directly to your document for iterative improvement
- **Flexible Workflow**: Choose from predefined templates or provide custom input
- **Context-Aware AI**: All agents receive your execution plan and current document for relevant suggestions

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (Lovable Cloud)
- **Edge Functions**: Deno runtime for serverless functions
- **AI Integration**: Dust AI API with custom agent configurations
- **Routing**: React Router v6

## Architecture:
<img width="6218" height="2416" alt="Untitled diagram-2025-11-08-165148" src="https://github.com/user-attachments/assets/7bd763ee-0b3e-4c65-8bb7-f826d5f487a3" />


## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher) and npm installed - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Dust AI account with API access
- Three configured Dust AI agents (Planning, Short Ask, Generic)


## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The project uses Supabase through Lovable Cloud. Environment variables are automatically configured:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### 4. Configure Dust AI Credentials

On first launch, you'll need to configure your Dust AI credentials:

1. Start the application (see below)
2. Click the **Settings** icon (⚙️) in the top right
3. Enter your Dust AI configuration:
   - **Workspace ID**: Your Dust workspace identifier
   - **API Key**: Your Dust API key
   - **Planning Agent ID**: Agent for document planning
   - **Short Ask Agent ID**: Agent for quick questions
   - **Generic Agent ID**: Agent for general assistance

Your credentials are stored locally in browser storage.

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at `http://localhost:8080`

### Production Build

```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### 1. Getting Started

1. Launch the application
2. Configure your Dust AI credentials (if not already done)
3. Choose a document template or enter custom input
4. Click "Generate Plan" to create your execution plan

### 2. Document Creation Workflow

**Step 1: Generate Execution Plan**
- Select a template (Business Proposal, Technical Report, etc.) or provide custom input
- The Planning Agent analyzes your request and creates a detailed outline

**Step 2: Document Editing**
- View your execution plan in the left panel
- Use the document editor on the right to write content
- Click "Copy Plan to Editor" to start with the AI-generated structure

**Step 3: Refine with AI**
- Select a refinement agent (Planning, Short Ask, or Generic)
- Add instructions for how to improve your text
- Click "Refine Text" to get AI suggestions
- Review and apply changes to your document

**Step 4: Interactive Q&A**
- Use the Agent Chat section to ask questions
- Get contextual help based on your plan and current document
- Apply agent responses directly to your document with "Apply to Document"

**Step 5: Export**
- Click the "Export Document" button to download as `.txt`

### 3. Tips for Best Results

- **Be Specific**: Provide clear, detailed input for better planning results
- **Iterate**: Use the refine feature multiple times to progressively improve sections
- **Context Matters**: All agents have access to your plan and document for relevant responses
- **Mix Agents**: Use different agents for different tasks:
  - Planning: Structure and organization
  - Short Ask: Quick facts and clarifications
  - Generic: Flexible content generation

## 🗂️ Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── NavLink.tsx     # Navigation component
│   │   └── SettingsModal.tsx # Credentials configuration
│   ├── contexts/           # React context providers
│   │   └── AppContext.tsx  # Global state management
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Home page (redirects)
│   │   ├── DocumentInput.tsx    # Document creation start
│   │   └── DocumentExecution.tsx # Main editing interface
│   ├── services/           # API services
│   │   └── dustApi.ts      # Dust AI integration
│   └── integrations/       # External integrations
│       └── supabase/       # Supabase client & types
├── supabase/
│   ├── functions/          # Edge functions
│   │   ├── dust-planning/  # Planning agent endpoint
│   │   ├── dust-short-ask/ # Short ask agent endpoint
│   │   └── dust-generic/   # Generic agent endpoint
│   └── config.toml         # Supabase configuration
└── public/                 # Static assets
```

## 🔒 Security Notes

- API keys are stored in browser localStorage (client-side only)
- Edge functions handle all Dust AI API communication securely
- Never commit API keys to version control
- Edge functions use environment variables for sensitive data

## 🚀 Deployment

### Deploy with Lovable

1. Open your project in [Lovable](https://lovable.dev)
2. Click **Share → Publish**
3. Your app will be deployed with automatic HTTPS

### Custom Domain

To connect a custom domain:
1. Navigate to **Project > Settings > Domains**
2. Click **Connect Domain**
3. Follow the DNS configuration instructions

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is built with Lovable and is available for personal and commercial use.

## 🆘 Support

For issues, questions, or suggestions:
- Open an issue in this repository
- Contact through [Lovable Support](https://docs.lovable.dev)

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- Powered by [Dust AI](https://dust.tt)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Backend by [Supabase](https://supabase.com)

---

**Project URL**: https://lovable.dev/projects/f17f466e-a3c3-4176-9cf5-7efa4d02daac
