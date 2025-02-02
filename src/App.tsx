import { useEffect } from "react";
import SplitBillCalculator from "./components/SplitBillCalculator";

function App() {
  useEffect(() => {
    document.title = "Kalkulator Patungan";
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <SplitBillCalculator />
    </div>
  );
}

export default App;