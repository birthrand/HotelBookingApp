import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { getCurrentUser, getWishlist, toggleWishlist } from "./appwrite";

interface WishlistContextType {
  wishlist: string[]; // store hotel IDs
  toggleWishlistHandler: (hotelId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  // Fetch user and wishlist on mount
  useEffect(() => {
    const fetchUserAndWishlist = async () => {
      const user = await getCurrentUser();
      if (!user?.$id) return;
      setCurrentUserId(user.$id);
      try {
        const hotels = await getWishlist({ userId: user.$id });
        // console.log(
        //   "items hotel ids:",
        //   items.map((item: any) => item.hotelId)
        // );
        // console.log("hotels:", hotels);
        // Extract hotel IDs from the hotel objects
        const hotelIds = hotels.map((hotel: any) => hotel.$id).filter(Boolean);
        setWishlist(hotelIds); // store IDs
      } catch (error) {
        console.log("error:", error);
      }
    };
    fetchUserAndWishlist();
  }, []);

  const refreshWishlist = async () => {
    const user = await getCurrentUser();
    if (!user?.$id) return;
    const hotels = await getWishlist({ userId: user.$id });
    const hotelIds = hotels.map((hotel: any) => hotel.$id).filter(Boolean);
    console.log("refreshed wishlist:", hotelIds);
    setWishlist(hotelIds);
  };

  const toggleWishlistHandler = async (hotelId: string) => {
    const user = await getCurrentUser();
    if (!user?.$id) {
      console.log("user not found");
      return;
    }
    console.log("Toggling wishlist - userId:", user.$id, "hotelId:", hotelId);

    const added = await toggleWishlist({
      userId: user.$id,
      hotelId: hotelId,
    });

    setWishlist((prev) => {
      const updated = added
        ? [...prev, hotelId]
        : prev.filter((id) => id !== hotelId);
      console.log("wishlist after toggle:", updated);
      return updated;
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlistHandler, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
