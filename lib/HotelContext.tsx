import { createContext, useState, useContext, ReactNode } from "react";

interface HotelContextType {
  selectedHotel: any | null;
  setSelectedHotel: (room: any | null) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
};

export const HotelProvider = ({ children }: { children: ReactNode }) => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  return (
    <HotelContext.Provider value={{ selectedHotel, setSelectedHotel }}>
      {children}
    </HotelContext.Provider>
  );
};
