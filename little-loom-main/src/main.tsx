import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; text-align: center;">
      <h1>⚠️ Root element not found</h1>
      <p>Unable to mount React application. Please check the HTML structure.</p>
    </div>
  `;
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error("Failed to render app:", error);
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: system-ui, sans-serif; text-align: center; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 1rem; max-width: 600px; margin: 0 auto;">
          <h1 style="font-size: 3rem; margin: 0 0 1rem 0;">⚠️</h1>
          <h2>Error Loading Application</h2>
          <p style="margin: 1rem 0;">${error instanceof Error ? error.message : String(error)}</p>
          <button onclick="window.location.reload()" style="padding: 0.75rem 1.5rem; background: white; color: #667eea; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: bold; margin-top: 1rem;">
            Reload Page
          </button>
          <p style="margin-top: 1rem; font-size: 0.875rem; opacity: 0.8;">Please check the browser console (F12) for more details.</p>
        </div>
      </div>
    `;
  }
}
