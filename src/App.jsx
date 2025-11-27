import { useState } from "react";
import AlgorithmSelector from "./components/AlgorithmSelector";
import Simulator from "./components/Simulator";

export default function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

  if (!selectedAlgorithm) {
    return <AlgorithmSelector onSelect={setSelectedAlgorithm} />;
  }

  return (
    <Simulator
      algorithm={selectedAlgorithm}
      onBack={() => setSelectedAlgorithm(null)}
    />
  );
}