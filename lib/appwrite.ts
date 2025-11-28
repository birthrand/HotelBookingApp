import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Query,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export const config = {
  platform: "com.chuks.hoteliq",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  hotelImagesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_HOTEL_IMAGES_COLLECTION_ID,
  roomImagesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_ROOM_IMAGES_COLLECTION_ID,
  hotelsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_HOTELS_COLLECTION_ID,
  roomsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ROOMS_COLLECTION_ID,
  usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
  bookingsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID,
  paymentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  wishlistCollectionId: process.env.EXPO_PUBLIC_APPWRITE_WISHLIST_COLLECTION_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export const createUserIfNotExists = async (authUser: any) => {
  try {
    // Check if user document already exists
    const users = await databases.listDocuments(
      config.databaseId!,
      config.usersCollectionId!,
      [Query.equal("auth_id", authUser.$id)]
    );

    if (users.total > 0) {
      return users.documents[0]; // user already exists
    }

    // User does not exist → create new
    const newUser = await databases.createDocument(
      config.databaseId!,
      config.usersCollectionId!,
      "unique()",
      {
        auth_id: authUser.$id,
        email: authUser.email,
        full_name: authUser.name,
        role: "user",
        avatar: authUser.prefs?.avatar || "",
      }
    );

    return newUser;
  } catch (error) {
    console.log("createUserIfNotExists error:", error);
    throw error;
  }
};

export async function login() {
  try {
    try {
      await account.deleteSession("current");
    } catch (error) {
      // Ignore error if no session exists
      console.log("No active session to delete");
    }
    const redirectUri = Linking.createURL("/");
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) throw new Error("Failed to login");

    const browserResult = await WebBrowser.openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type != "success") throw new Error("Failed to login");

    const url = new URL(browserResult.url);

    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) throw new Error("Failed to login");

    const session = await account.createSession(userId, secret);

    if (!session) throw new Error("Failed to create a session");

    // Get authenticated Appwrite user
    const authUser = await account.get();

    // Create a DB user if they do not already exist
    await createUserIfNotExists(authUser);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
function getInitials(name: string) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export async function getCurrentUser() {
  try {
    const authUser = await account.get();
    if (!authUser.$id) return null;

    // Fetch database user linked to auth ID
    const dbUserRes = await databases.listDocuments(
      config.databaseId!,
      config.usersCollectionId!,
      [Query.equal("auth_id", authUser.$id)]
    );

    const dbUser = dbUserRes.documents[0];
    if (!dbUser) return null;
    const userAvatar = getInitials(dbUser.full_name);

    return {
      ...dbUser,
      avatar: userAvatar.toString(),
    };
  } catch (error) {
    if (
      error?.code === 401 ||
      error?.message?.includes("scopes") ||
      error?.message?.includes("guests")
    ) {
      return null;
    }
    console.error(error);
    return null;
  }
}

export async function getLatestHotels() {
  try {
    const featured = await databases.listDocuments(
      config.databaseId!,
      config.hotelsCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );

    // console.log(featured.documents);
    const hotelWithImagesAndPrices = await Promise.all(
      featured.documents.map(async (hotel) => {
        const image = await databases.listDocuments(
          config.databaseId!,
          config.hotelImagesCollectionId!,
          [Query.equal("hotel_id", hotel.$id), Query.equal("is_primary", true)]
        );
        // Get rooms to find minimum price
        const rooms = await databases.listDocuments(
          config.databaseId!,
          config.roomsCollectionId!,
          [
            Query.equal("hotel_id", hotel.$id),
            Query.orderAsc("price_per_night"),
            Query.limit(1),
          ]
        );

        // Get the minimum price (first room after sorting)
        const minPrice = rooms.documents[0]?.price_per_night || 0;
        return {
          ...hotel,
          primaryImage: image.documents[0]?.image_url,
          price: minPrice,
        };
      })
    );

    return hotelWithImagesAndPrices;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getDestinations() {
  try {
    const hotels = await databases.listDocuments(
      config.databaseId!,
      config.hotelsCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );

    // Group hotels by city
    const cityMap = new Map();

    for (const hotel of hotels.documents) {
      const cityKey = `${hotel.city}, ${hotel.country}`;
      if (!cityMap.has(cityKey)) {
        // Get primary image for this hotel
        const image = await databases.listDocuments(
          config.databaseId!,
          config.hotelImagesCollectionId!,
          [
            Query.equal("hotel_id", hotel.$id),
            Query.equal("is_primary", true),
            Query.limit(1),
          ]
        );

        cityMap.set(cityKey, {
          id: hotel.$id,
          city: hotel.city,
          country: hotel.country,
          name: cityKey,
          image:
            image.documents[0]?.image_url ||
            "https://images.unsplash.com/photo-1486308510493-aa64833634ef",
        });
      }
    }

    // Convert map to array and take first 4-5 unique destinations
    return Array.from(cityMap.values()).slice(0, 5);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
}

export async function getHotelsById({ id }: { id: string }) {
  try {
    const featured = await databases.listDocuments(
      config.databaseId!,
      config.hotelsCollectionId!,
      [Query.equal("$id", id)]
    );

    // console.log("test log:", featured);

    const hotelIdWithImages = await Promise.all(
      featured.documents.map(async (hotel: any) => {
        const images = await databases.listDocuments(
          config.databaseId!,
          config.hotelImagesCollectionId!,
          [Query.equal("hotel_id", hotel.$id)]
        );
        const imageUrls = images.documents.map((i: any) => ({
          image_url: i.image_url,
          is_primary: i.is_primary,
        }));
        const rooms = await databases.listDocuments(
          config.databaseId!,
          config.roomsCollectionId!,
          [Query.equal("hotel_id", hotel.$id)]
        );

        return {
          ...hotel,
          roomImageAndType: rooms.documents,
          images: imageUrls,
        };
      })
    );

    return hotelIdWithImages;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getRoomsByHotelId({ id }: { id: string }) {
  try {
    // Get rooms by hotel_id
    const roomsRes = await databases.listDocuments(
      config.databaseId!,
      config.roomsCollectionId!,
      [Query.equal("hotel_id", id)]
    );

    // Get images for each room
    const roomsWithImages = await Promise.all(
      roomsRes.documents.map(async (room: any) => {
        const roomImagesRes = await databases.listDocuments(
          config.databaseId!,
          config.roomImagesCollectionId!,
          [Query.equal("room_id", room.$id)]
        );

        const imageUrls = roomImagesRes.documents.map((img: any) => ({
          image_url: img.image_url,
          //   is_primary: img.is_primary,
        }));

        // console.log("imageUrls:", imageUrls);
        return {
          ...room,
          images: imageUrls,
        };
      })
    );

    return roomsWithImages;
  } catch (error) {
    console.error("Error fetching rooms by hotel ID:", error);
    return [];
  }
}

export async function updateUser(userId: string, data: any) {
  try {
    const users = await databases.listDocuments(
      config.databaseId!,
      config.usersCollectionId!,
      [Query.equal("auth_id", userId)]
    );

    if (users.total === 0) throw new Error("User not found");

    const userDocId = users.documents[0].$id;

    const response = await databases.updateDocument(
      config.databaseId!,
      config.usersCollectionId!,
      userDocId,
      data
    );

    console.log("Updated:", response);
    return response;
  } catch (error) {
    console.log("Update user error:", error);
    throw error;
  }
}

export async function getHotels({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];
    // if (filter && filter !== "All") {
    //   buildQuery.push(Query.equal("type", filter));
    // }
    if (query) {
      buildQuery.push(
        Query.or([
          Query.search("hotelName", query),
          Query.search("address", query),
          Query.search("city", query),
          Query.search("country", query),
        ])
      );
    }

    if (limit) {
      buildQuery.push(Query.limit(limit));
    }

    const result = await databases.listDocuments(
      config.databaseId!,
      config.hotelsCollectionId!,
      buildQuery
    );
    // Fetch images and prices for each hotel
    const hotelsWithImagesAndPrices = await Promise.all(
      result.documents.map(async (hotel) => {
        // Get primary image
        const image = await databases.listDocuments(
          config.databaseId!,
          config.hotelImagesCollectionId!,
          [Query.equal("hotel_id", hotel.$id), Query.equal("is_primary", true)]
        );

        // Get minimum room price
        const rooms = await databases.listDocuments(
          config.databaseId!,
          config.roomsCollectionId!,
          [
            Query.equal("hotel_id", hotel.$id),
            Query.orderAsc("price_per_night"),
            Query.limit(1),
          ]
        );

        const minPrice = rooms.documents[0]?.price_per_night || 0;

        return {
          ...hotel,
          primaryImage: image.documents[0]?.image_url,
          price: minPrice,
        };
      })
    );

    return hotelsWithImagesAndPrices;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addWishlist({
  userId,
  hotelId,
}: {
  userId: string;
  hotelId: string;
}) {
  console.log("Adding wishlist - userId:", userId, "hotelId:", hotelId);
  try {
    const wishlist = await databases.createDocument(
      config.databaseId!,
      config.wishlistCollectionId!,
      ID.unique(),
      {
        userId: userId,
        hotelId: hotelId,
      }
    );
    // console.log("added wishlist:", wishlist);

    return true;
  } catch (error) {
    console.error("Error when adding wishlist:", error);
    return false;
  }
}

export async function removeWishlist({
  userId,
  hotelId,
}: {
  userId: string;
  hotelId: string;
}) {
  try {
    const wishlist = await databases.listDocuments(
      config.databaseId!,
      config.wishlistCollectionId!,
      [Query.equal("userId", userId), Query.equal("hotelId", hotelId)]
    );
    if (wishlist.total > 0) {
      await databases.deleteDocument(
        config.databaseId!,
        config.wishlistCollectionId!,
        wishlist.documents[0].$id
      );
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error removing wishlist:", error);
    return false;
  }
}

export async function getWishlist({ userId }: { userId: string }) {
  try {
    // Fetch wishlist items and expand hotel document
    const wishlistWithHotels = await databases.listDocuments(
      config.databaseId!,
      config.wishlistCollectionId!,
      [
        Query.equal("userId", userId),
        Query.select(["*", "hotelId.*"]), // expand the related hotel
      ]
    );

    // For each hotel, fetch its primary image
    const hotelsWithImages = await Promise.all(
      wishlistWithHotels.documents.map(async (item: any) => {
        const hotel = item.hotelId;
        if (!hotel) return null;

        const imageResult = await databases.listDocuments(
          config.databaseId!,
          config.hotelImagesCollectionId!,
          [Query.equal("hotel_id", hotel.$id), Query.equal("is_primary", true)]
        );

        const rooms = await databases.listDocuments(
          config.databaseId!,
          config.roomsCollectionId!,
          [Query.equal("hotel_id", hotel.$id)]
        );
        const minPrice = rooms.documents[0]?.price_per_night || 0;

        return {
          ...hotel,
          primaryImage: imageResult.documents[0]?.image_url || null,
          price: minPrice,
        };
      })
    );

    // Filter out any nulls (in case a wishlist item has no hotel)
    return hotelsWithImages.filter(Boolean);
  } catch (error) {
    console.error("Error getting wishlist:", error);
    return [];
  }
}

export async function toggleWishlist({
  userId,
  hotelId,
}: {
  userId: string;
  hotelId: string;
}) {
  try {
    const wishlist = await databases.listDocuments(
      config.databaseId!,
      config.wishlistCollectionId!,
      [Query.equal("userId", userId), Query.equal("hotelId", hotelId)]
    );
    // console.log("wishlist total:", wishlist.total);
    if (wishlist.total > 0) {
      await removeWishlist({ userId, hotelId });
      return false;
    } else {
      await addWishlist({ userId, hotelId });
      return true;
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return false;
  }
}

export async function createBooking({
  userId,
  hotelId,
  checkInDate,
  checkOutDate,
  roomId,
  numberOfGuests,
  totalPrice,
  status,
}: {
  userId: string;
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  roomId: string;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
}) {
  try {
    const booking = await databases.createDocument(
      config.databaseId!,
      config.bookingsCollectionId!,
      ID.unique(),
      {
        user_id: userId,
        hotel_id: hotelId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        room_id: roomId,
        number_of_guests: numberOfGuests,
        total_price: totalPrice,
        status: status,
      }
    );
    return true;
  } catch (error) {
    console.error("Error creating booking:", error);
    return null;
  }
}
export async function getLastBookingByUserId({ userId }: { userId: string }) {
  const result = await databases.listDocuments(
    config.databaseId!,
    config.bookingsCollectionId!,
    [
      Query.equal("user_id", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(1),
    ]
  );

  return result.documents[0]; // last booking
}

export async function getBookingsByUserId({ userId }: { userId: string }) {
  const result = await databases.listDocuments(
    config.databaseId!,
    config.bookingsCollectionId!,
    [Query.equal("user_id", userId)]
  );

  const bookingsWithHotels = await Promise.all(
    result.documents.map(async (booking) => {
      const hotel = await databases.listDocuments(
        config.databaseId!,
        config.hotelsCollectionId!,
        [Query.equal("$id", booking.hotel_id)]
      );
      const image = await databases.listDocuments(
        config.databaseId!,
        config.hotelImagesCollectionId!,
        [
          Query.equal("hotel_id", hotel.documents[0].$id),
          Query.equal("is_primary", true),
        ]
      );
      return {
        ...booking,
        hotel: hotel.documents[0],
        primaryImage: image.documents[0]?.image_url,
      };
    })
  );
  return bookingsWithHotels;
}

export async function updateBookingStatus(bookingId: string, status: string) {
  try {
    const booking = await databases.updateDocument(
      config.databaseId!,
      config.bookingsCollectionId!,
      bookingId,
      { status: status }
    );
    return booking;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return null;
  }
}

export async function createPayment({
  userId,
  bookingId,
  paymentMethod,
  paymentStatus,
  paymentAmount,
}: {
  userId: string;
  bookingId: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentAmount: number;
}) {
  try {
    const payment = await databases.createDocument(
      config.databaseId!,
      config.paymentsCollectionId!,
      ID.unique(),
      {
        user_id: userId,
        booking_id: bookingId,
        method: paymentMethod,
        payment_status: paymentStatus,
        amount: paymentAmount,
      }
    );
    return payment;
  } catch (error) {
    console.error("Error creating payment:", error);
    return null;
  }
}
