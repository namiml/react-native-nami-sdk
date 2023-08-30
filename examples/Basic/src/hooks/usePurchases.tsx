import React, { createContext, useState, useContext, useMemo } from 'react';

interface IPurchasesContext {
  children: React.ReactNode;
}

interface PurchasesContextType {
  purchases: string[];
  setPurchases: (purchases: string[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const PurchasesContext = createContext<PurchasesContextType | null>(null);

export const PurchasesContextProvider = ({ children }: IPurchasesContext) => {
  const [purchases, setPurchases] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      purchases,
      setPurchases,
    }),
    [purchases, setPurchases],
  );

  return (
    <PurchasesContext.Provider value={value}>
      {children}
    </PurchasesContext.Provider>
  );
};

export const usePurchasesContext = () => {
  const purchasesContext = useContext(PurchasesContext);

  if (!purchasesContext) {
    throw new Error('calling usePurchasesContext out of PurchasesContext');
  }

  return purchasesContext;
};
