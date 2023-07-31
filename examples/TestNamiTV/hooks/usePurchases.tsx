import React, { createContext, useState, useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const PurchasesContext = createContext([[], () => {}]);

export const PurchasesContextProvider = ({ children }) => {
  const [purchases, setPurchases] = useState<[] as any[]>([]);
  return (
    <PurchasesContext.Provider value={[purchases, setPurchases]}>
      {children}
    </PurchasesContext.Provider>
  );
};

export const usePurchasesContext = () => {
  const [purchases, setPurchases] = useContext(PurchasesContext);

  return {
    purchases,
    setPurchases,
  };
};
