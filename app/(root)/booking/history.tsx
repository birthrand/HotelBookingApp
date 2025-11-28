import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAppwrite } from "@/lib/useAppwrite";
import { getBookingsByUserId } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { updateBookingStatus } from "@/lib/appwrite";
import LoadingScreen from "@/components/loadingScreen";

// Mock booking history data
// const mockBookingHistory = [
//   {
//     id: "1",
//     hotelName: "Quality Inn & Suites",
//     city: "Regina",
//     country: "Canada",
//     checkIn: "Jul 13, 2025",
//     checkOut: "Jul 14, 2025",
//     guests: 2,
//     rooms: 1,
//     totalPrice: 289,
//     status: "Completed",
//     image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
//   },
//   {
//     id: "2",
//     hotelName: "Sunset Paradise Resort",
//     city: "Maldives",
//     country: "Maldives",
//     checkIn: "Jun 20, 2025",
//     checkOut: "Jun 25, 2025",
//     guests: 2,
//     rooms: 1,
//     totalPrice: 2250,
//     status: "Completed",
//     image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
//   },
//   {
//     id: "3",
//     hotelName: "Mountain View Lodge",
//     city: "Aspen",
//     country: "United States",
//     checkIn: "May 10, 2025",
//     checkOut: "May 15, 2025",
//     guests: 4,
//     rooms: 2,
//     totalPrice: 1900,
//     status: "Cancelled",
//     image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
//   },
// ];

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-slate-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

const BookingHistoryCard = ({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) => {
  return (
    <View className="mb-5 px-1 shadow-sm">
      <View className="bg-blue-50/50 rounded-3xl">
        <View className="bg-white rounded-2xl overflow-hidden">
          <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
            <View className="relative">
              <ImageBackground
                source={{ uri: item.primaryImage }}
                className="w-full h-44"
                resizeMode="cover"
                imageStyle={{
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.5)", "transparent"]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
                <View className="absolute top-4 right-4 flex-row items-center gap-1.5">
                  <View
                    className={`${getStatusColor(
                      item.status
                    )} rounded-full px-3 py-1.5`}
                  >
                    <Text
                      className={`text-xs font-semibold uppercase text-white`}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View className="absolute bottom-4 left-4 right-4">
                  <Text className="text-white text-xl font-semibold mb-1">
                    {item.hotel.hotelName}
                  </Text>
                  <View className="flex-row items-center">
                    <Feather name="map-pin" size={14} color="#E5E7EB" />
                    <Text className="text-gray-200 text-sm ml-1">
                      {item.hotel.city}, {item.hotel.country}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>

            <View className="p-5 gap-4">
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-gray-400 text-xs uppercase tracking-wide">
                    Check-in
                  </Text>
                  <Text className="text-gray-600 font-semibold mt-1">
                    {formatDate(item.check_in_date)}
                  </Text>
                </View>
                <View className="w-px bg-gray-200 mx-4" />
                <View>
                  <Text className="text-gray-400 text-xs uppercase tracking-wide">
                    Check-out
                  </Text>
                  <Text className="text-gray-600 font-semibold mt-1">
                    {formatDate(item.check_out_date)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between rounded-xl bg-gray-50 px-4 py-3">
                <View className="flex-row items-center gap-2">
                  <Feather name="users" size={16} color="#6B7280" />
                  <Text className="text-gray-600 text-sm">
                    {item.number_of_guests}{" "}
                    {item.number_of_guests === 1 ? "Guest" : "Guests"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Feather name="home" size={16} color="#6B7280" />
                  <Text className="text-gray-600 text-sm">1 Room</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-400 text-xs uppercase tracking-wide">
                    Total Paid
                  </Text>
                  <Text className="text-gray-600 text-2xl font-bold">
                    ${item.total_price}
                  </Text>
                </View>
                <TouchableOpacity
                  className="border border-blue-300 px-5 py-3 rounded-xl"
                  onPress={onPress}
                >
                  <Text className="text-blue-300 font-semibold">
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const History = () => {
  // const [bookingHistory, setBookingHistory] = useState(mockBookingHistory);
  const { user } = useGlobalContext();
  const { data: bookings, loading } = useAppwrite({
    fn: getBookingsByUserId,
    params: { userId: user?.$id! },
  });

  const completedBookings =
    bookings?.filter((b: any) => b.status === "completed") ?? [];

  console.log("completedBookings: ", completedBookings);

  if (loading) return <LoadingScreen message="Loading..." />;

  const handleViewDetails = (id: string) => {
    // Navigate to booking details
    console.log("View booking details:", id);
  };

  return (
    <View className="mb-24">
      {completedBookings.length > 0 ? (
        <FlatList
          data={completedBookings}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <BookingHistoryCard
              item={item}
              onPress={() => handleViewDetails(item.$id)}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        // Empty State
        <View className="items-center justify-center px-6 py-20">
          <View className="bg-white rounded-full p-8 mb-6">
            <Feather name="calendar" size={64} color="#D1D5DB" />
          </View>
          <Text className="text-2xl font-semibold text-black/80 mb-2">
            No booking history
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Your past bookings will appear here once you've completed a stay
          </Text>
          <TouchableOpacity
            className="bg-blue-300 px-8 py-4 rounded-xl"
            onPress={() => router.push("/")}
          >
            <Text className="text-white font-semibold text-base">
              Book Your First Stay
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default History;
