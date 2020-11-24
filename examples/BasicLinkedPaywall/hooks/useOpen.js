import React, {createContext, useState, useContext} from 'react';

const OpenContext = createContext();

export const OpenContextProvider = ({children}) => {
  const [open, setOpen] = useState(false);
  return (
    <OpenContext.Provider value={[open, setOpen]}>
      {children}
    </OpenContext.Provider>
  );
};

export const useOpenContext = () => {
  const [open, setOpen] = useContext(OpenContext);

  return {
    open,
    setOpen,
  };
};
