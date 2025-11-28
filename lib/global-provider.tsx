import { createContext, ReactNode, useContext } from "react";
import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "@/lib/useAppwrite";

interface User {
  $id: string;
  full_name: string;
  email: string;
  avatar: string;
  role: string;
  auth_id: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    loading,
    refetch: refetchUser,
  } = useAppwrite({
    fn: (_params?: Record<string, string | number>) =>
      getCurrentUser() as Promise<User | null>,
    params: {} as Record<string, string | number>,
  });

  // double exclamation mark operator to convert the user object to a boolean value. true if user is not null, false otherwise
  const isLoggedIn = !!user;

  // log the user object/information to the console
  // console.log(JSON.stringify(user, null, 2));

  const refetch = async () => {
    await refetchUser();
  };
  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user: user || null,
        loading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);

  // if the context is not found, throw an error
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;
