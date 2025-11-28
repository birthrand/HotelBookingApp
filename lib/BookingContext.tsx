import React, { createContext, useContext, useState } from "react";

interface BookingInfo {
  user_id: string;
  hotel_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
}

interface BookingContextType {
  bookingInfo: BookingInfo;
  updateBookingInfo: (update: Partial<BookingInfo>) => void;
  clearBookingInfo: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export const BookingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bookingInfo, setBookingInfo] = useState<BookingInfo>({
    user_id: "",
    hotel_id: "",
    room_id: "",
    check_in_date: "",
    check_out_date: "",
    total_price: 0,
  });

  const updateBookingInfo = (update: Partial<BookingInfo>) => {
    setBookingInfo((prev) => ({ ...prev, ...update }));
  };

  const clearBookingInfo = () => {
    setBookingInfo({
      user_id: "",
      hotel_id: "",
      room_id: "",
      check_in_date: "",
      check_out_date: "",
      total_price: 0,
    });
  };

  return (
    <BookingContext.Provider
      value={{ bookingInfo, updateBookingInfo, clearBookingInfo }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
