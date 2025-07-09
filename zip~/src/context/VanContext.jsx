import { createContext, useContext, useState } from 'react';

// Step 1: Create the context
const VanContext = createContext();

// Step 2: Create the provider component
export function VanProvider({ children }) {
  const [vanName, setVanName] = useState(null); // global state

  return (
    <VanContext.Provider value={{ vanName, setVanName }}>
      {children}
    </VanContext.Provider>
  );
}

// Step 3: Create custom hook for easier use
export function useVanContext() {
  return useContext(VanContext);
}
