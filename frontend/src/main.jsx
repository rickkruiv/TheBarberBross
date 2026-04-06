import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import App from "./App.jsx"
import { CustomThemeProvider } from "./contexts/ThemeContext.jsx"

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 30000 } }
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <App />
        <ToastContainer />
      </CustomThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
