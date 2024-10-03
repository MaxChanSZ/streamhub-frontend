import ReactDOM from "react-dom/client";
import "@/index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppContextProvider } from "./contexts/AppContext";
import ReactDOMRun from "./routes/ReactDOMRun";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // prevent unlimited retries
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AppContextProvider>
      <ReactDOMRun />
    </AppContextProvider>
  </QueryClientProvider>
);
