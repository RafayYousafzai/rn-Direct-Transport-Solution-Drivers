import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // getCurrentUser()
    //   .then((result) => {
    //     if (result) {
    //       setIsLoggedIn(true);
    //       setUser(result);
    //     } else {
    //       setIsLoggedIn(false);
    //       setUser(null);
    //     }
    //   })
    //   .catch((error) => console.log(error))
    //   .finally(() => setIsLoading(false));
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        setIsLoading,
        setUser,
        user,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider };
export default useGlobalContext;
