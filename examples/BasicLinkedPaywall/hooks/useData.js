import React, {createContext, useState, useContext} from 'react';

const DataContext = createContext();

export const DataContextProvider = ({children}) => {
  const [data, setData] = useState(null);
  return (
    <DataContext.Provider value={[data, setData]}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const [data, setData] = useContext(DataContext);

  return {
    data,
    setData,
  };
};
