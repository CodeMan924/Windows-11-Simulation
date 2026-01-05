
# Windows 11 Web Simulation

A high-fidelity Windows 11 experience built with React, Tailwind CSS, and Gemini AI.

## 🚀 Quick Start (No Installation Needed)
This project is designed to run directly in the browser. If you have a local static server (like the "Live Server" extension in VS Code), you can simply open `index.html`. All dependencies are loaded automatically via the `importmap`.

## 🛠️ Local Development (Standard Setup)
To install dependencies for a professional build environment, ensure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```

### Environment Setup
For the Copilot feature to work, the application expects an environment variable `API_KEY` (your Google Gemini API Key). 

- **In the current web context:** It is automatically injected.
- **In a local Vite setup:** You may need to use a `.env` file and adjust the reference from `process.env.API_KEY` to `import.meta.env.VITE_API_KEY`.

## 🎨 Features
- **Functional Taskbar & Start Menu**
- **Window Management** (Drag, Maximize, Minimize, Snap)
- **Settings App:** Full theme color personalization and Dark/Light mode support.
- **Explorer:** Functional file navigation.
- **Notepad:** File saving and "Find" functionality.
- **Copilot:** AI assistant powered by Gemini.
