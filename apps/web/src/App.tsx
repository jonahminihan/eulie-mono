import { TooltipProvider } from "@/components/ui/tooltip";
import "./App.css";
import AgentsPage from "./pages/agents-page/AgentsPage";

function App() {
  return (
    <TooltipProvider>
      <AgentsPage />
    </TooltipProvider>
  );
}

export default App;
