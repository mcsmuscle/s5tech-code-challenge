import { AppProviders } from "./app/providers/AppProviders";
import { SwapPage } from "./pages/SwapPage";

function App() {
  return (
    <AppProviders>
      <SwapPage />
    </AppProviders>
  );
}

export default App;
