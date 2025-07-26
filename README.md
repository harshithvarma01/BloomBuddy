# BloomBuddy - AI-Powered Health Companion

## Project Overview

BloomBuddy is an AI-powered health companion application that provides personalized health insights and risk analysis. The platform allows users to analyze symptoms and medical reports to get intelligent health assessments.

## Features

- AI-powered symptom analysis
- Medical report processing
- Personalized health insights
- Risk assessment and predictions
- User-friendly chat interface
- File upload capabilities for medical documents

## How to run this project

### Prerequisites

Make sure you have Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation Steps

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd bloombuddy-ai-health

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - Frontend library
- **shadcn-ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Bun** - Fast JavaScript runtime and package manager

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-ui components
│   ├── ChatInterface.tsx
│   ├── DiseaseSelector.tsx
│   ├── FileUpload.tsx
│   ├── Header.tsx
│   └── PredictionForm.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── assets/             # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- ESLint for code linting
- TypeScript for type checking
- Prettier-compatible formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
