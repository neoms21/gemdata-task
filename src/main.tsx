import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();

async function enableMocking() {
  // if (import.meta.env.MODE !== 'development') {
  //   return
  // }
  // const { worker } = await import('./mocks/browser')
  // // `worker.start()` returns a Promise that resolves
  // // once the Service Worker is up and ready to intercept requests.
  // return worker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
});
