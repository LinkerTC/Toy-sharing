import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "react-hot-toast";

import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'

// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Development tools
const isDevelopment = import.meta.env.DEV;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GG_CLIENT_ID}>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                <App />

                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#ffffff",
                      color: "#374151",
                      padding: "16px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                      fontSize: "14px",
                      maxWidth: "400px",
                    },
                    success: {
                      iconTheme: {
                        primary: "#22c55e",
                        secondary: "#ffffff",
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: "#ef4444",
                        secondary: "#ffffff",
                      },
                    },
                    loading: {
                      iconTheme: {
                        primary: "#f075b7",
                        secondary: "#ffffff",
                      },
                    },
                  }}
                />

                {/* React Query DevTools (Development only) */}
                {isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)

// Performance monitoring
if (isDevelopment) {
  console.log("🎨 Toy Sharing App - Development Mode");
  console.log("🚀 Performance monitoring enabled");
}
