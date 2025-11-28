import { createContext, useState, useContext, ReactNode } from "react";

interface CheckInAndOutContextType {
  checkInDate: Date | null;
  setCheckInDate: (date: Date | null) => void;
  checkOutDate: Date | null;
  setCheckOutDate: (date: Date | null) => void;
}

const CheckInAndOutContext = createContext<
  CheckInAndOutContextType | undefined
>(undefined);

export const useCheckInAndOut = () => {
  const context = useContext(CheckInAndOutContext);
  if (!context) {
    throw new Error(
      "useCheckInAndOut must be used within a CheckInAndOutProvider"
    );
  }
  return context;
};

export const CheckInAndOutProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  return (
    <CheckInAndOutContext.Provider
      value={{ checkInDate, setCheckInDate, checkOutDate, setCheckOutDate }}
    >
      {children}
    </CheckInAndOutContext.Provider>
  );
};
