import { createContext, useState, useContext, ReactNode } from "react";

interface DateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface DateContextType {
  dateRange: DateRange;
  updateDateRange: (dateRange: DateRange) => void;
  getDateSummary: () => string; // Fixed: renamed from getDateRangeSummary
  getNumberOfNights: () => number;
  isDateRangeValid: () => boolean;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined,
  });

  const updateDateRange = (dateRange: DateRange) => {
    setDateRange(dateRange);
  };

  const getDateSummary = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return "Choose your dates";
    }

    // Format: "Jan 15 - Jan 20, 2024" or "Jan 15 - Feb 5, 2024"
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    const startFormatted = formatDate(dateRange.startDate);
    const endFormatted = formatDate(dateRange.endDate);
    const year = dateRange.endDate.getFullYear();

    // Only show year if it's different from current year or spans years
    const currentYear = new Date().getFullYear();
    const showYear =
      year !== currentYear ||
      dateRange.startDate.getFullYear() !== dateRange.endDate.getFullYear();

    return showYear
      ? `${startFormatted} - ${endFormatted}, ${year}`
      : `${startFormatted} - ${endFormatted}`;
  };

  const getNumberOfNights = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return 0;
    }
    const diffTime =
      dateRange.endDate.getTime() - dateRange.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isDateRangeValid = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return false;
    }
    return dateRange.endDate > dateRange.startDate;
  };

  return (
    <DateContext.Provider
      value={{
        dateRange,
        updateDateRange,
        getDateSummary, // Fixed: renamed
        getNumberOfNights,
        isDateRangeValid,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
