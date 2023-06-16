import React, { createContext, useState, useContext } from 'react';

const PurchasesContext = createContext([[], () => {}]);

export const PurchasesContextProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([]);
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
