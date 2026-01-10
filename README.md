# SVG Code Studio

A lightweight web application for converting SVG files to code. Built with **Vite + Vanilla JavaScript + Tailwind CSS**.

## Features

- 🎨 **SVG to Code** - Upload or drag-and-drop SVG files to extract the code
- 📋 **Copy to Clipboard** - One-click copy functionality
- 🔍 **Live Preview** - See your SVG rendered in real-time
- 📝 **Code Formatting** - Formatted and syntax-highlighted output
- 📦 **Minify/Format Toggle** - Switch between minified and formatted code
- 💾 **Download** - Download the SVG code as a file
- 📊 **SVG Metadata** - View file dimensions, element counts, and more
- 🎯 **Paste Support** - Paste SVG code directly with Ctrl/Cmd+V
- 🌙 **Dark Theme** - Modern dark UI for comfortable viewing

## Upcoming Features

- 🖼️ **PNG to SVG** - Convert raster images to vector format
- 🔄 **PNG to SVG Code** - Full image-to-code conversion pipeline

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd svg-code-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
svg-code-studio/
├── src/
│   ├── components/        # UI Components
│   │   ├── CodeDisplay.js   # Code output with syntax highlighting
│   │   ├── DropZone.js      # File upload drag-and-drop
│   │   ├── Footer.js        # App footer
│   │   ├── Header.js        # App header with navigation
│   │   ├── Preview.js       # SVG preview component
│   │   └── index.js         # Component exports
│   ├── config/
│   │   └── constants.js     # App configuration and constants
│   ├── services/
│   │   ├── svgService.js    # SVG parsing and manipulation
│   │   ├── toastService.js  # Toast notifications
│   │   └── index.js         # Service exports
│   ├── styles/
│   │   └── main.css         # Tailwind CSS and custom styles
│   ├── utils/
│   │   ├── domUtils.js      # DOM manipulation helpers
│   │   ├── fileUtils.js     # File handling utilities
│   │   └── index.js         # Utility exports
│   └── main.js              # Application entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Architecture

This project follows these design patterns and best practices:

- **Modular Architecture** - Separated concerns with components, services, and utilities
- **Component-Based Design** - Reusable UI components with encapsulated logic
- **Service Layer Pattern** - Business logic isolated in services
- **Observer Pattern** - State management with subscription-based updates
- **Single Responsibility Principle** - Each module has one clear purpose
- **DRY (Don't Repeat Yourself)** - Shared utilities and constants

## Tech Stack

- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - No framework overhead, pure ES6+ modules
- **Tailwind CSS** - Utility-first CSS framework
- **FileReader API** - Client-side file reading
- **DOMParser** - SVG parsing and validation

## License

MIT License - feel free to use this project for any purpose.
