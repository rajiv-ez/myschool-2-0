
console.log("main.tsx: Starting application...");

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("main.tsx: Imports loaded successfully");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("main.tsx: Root element not found!");
} else {
  console.log("main.tsx: Root element found, creating React root...");
  const root = createRoot(rootElement);
  console.log("main.tsx: React root created, rendering App...");
  root.render(<App />);
  console.log("main.tsx: App rendered successfully");
}
