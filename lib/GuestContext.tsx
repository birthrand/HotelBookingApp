import { createContext, useState, useContext, ReactNode } from "react";

interface GuestInfo {
  rooms: number;
  adults: number;
  children: number;
  pets: number;
}

interface GuestContextType {
  guestInfo: GuestInfo;
  updateGuestInfo: (info: GuestInfo) => void;
  getGuestSummary: () => string;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
};

export const GuestProvider = ({ children }: { children: ReactNode }) => {
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    rooms: 1,
    adults: 1,
    children: 0,
    pets: 0,
  });

  const updateGuestInfo = (info: GuestInfo) => {
    setGuestInfo(info);
  };

  const getGuestSummary = () => {
    const totalGuests = guestInfo.adults + guestInfo.children;
    const guestText = `${totalGuests} ${
      totalGuests === 1 ? "guest" : "guests"
    }`;
    const roomText = `${guestInfo.rooms} ${
      guestInfo.rooms === 1 ? "room" : "rooms"
    }`;
    const petText = guestInfo.pets > 0 ? `, ${guestInfo.pets} pet` : "";
    return `${guestText} • ${roomText}${petText}`;
  };

  return (
    <GuestContext.Provider
      value={{ guestInfo, updateGuestInfo, getGuestSummary }}
    >
      {children}
    </GuestContext.Provider>
  );
};
