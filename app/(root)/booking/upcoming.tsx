import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import funTravelPic from "@/assets/images/funTravel.png";
import { Image } from "react-native";
import LoadingScreen from "@/components/loadingScreen";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAppwrite } from "@/lib/useAppwrite";
import { getBookingsByUserId } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "pending":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const UpcomingCard = ({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) => {
  return (
    <View className="shadow-sm">
      <TouchableOpacity
        className="mb-4 rounded-2xl overflow-hidden bg-white"
        onPress={onPress}
        activeOpacity={0.9}
      >
        {/* Hotel Image Section */}
        <View className="h-40">
          <ImageBackground
            source={{ uri: item.primaryImage }}
            className="w-full h-full"
            resizeMode="cover"
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

            {/* Status Badge */}
            <View className="absolute top-3 right-3">
              <View
                className={`${getStatusColor(
                  item.status
                )} rounded-full px-3 py-1.5`}
              >
                <Text className="text-white text-xs font-semibold">
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Hotel Name Overlay */}
            <View className="absolute bottom-3 left-3 right-3">
              <Text className="text-white text-xl font-bold">
                {item.hotel.hotelName}
              </Text>
              <View className="flex-row items-center mt-1">
                <Feather name="map-pin" size={14} color="#E5E7EB" />
                <Text className="text-gray-200 text-sm ml-1">
                  {item.hotel.city}, {item.hotel.country}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Booking Details Section */}
        <View className="p-4 bg-white">
          {/* Check-in/out dates */}
          <View className="flex-row items-center mb-3">
            <Feather name="calendar" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-2">
              {formatDate(item.check_in_date)} -{" "}
              {formatDate(item.check_out_date)}
            </Text>
          </View>

          {/* Guests and Rooms */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Feather name="users" size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">
                {item.number_of_guests}{" "}
                {item.number_of_guests === 1 ? "Guest" : "Guests"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="home" size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2">
                {/* {item.rooms} {item.rooms === 1 ? "Room" : "Rooms"} */}1 Room
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-200 pt-3 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-500 text-xs">Total Paid</Text>
              <Text className="text-blue-300 font-bold text-lg">
                ${item.total_price}
              </Text>
            </View>
            <TouchableOpacity
              className="border border-blue-300 rounded-xl px-5 py-3"
              onPress={onPress}
            >
              <Text className="text-blue-300 font-semibold">View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Upcoming = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useGlobalContext();
  const { data: bookingData, loading } = useAppwrite({
    fn: getBookingsByUserId,
    params: { userId: user?.$id! },
  });

  const bookings =
    bookingData?.filter((b: any) => b.status !== "completed") ?? [];
  console.log("bookings: ", bookings);

  const handleBookingDetails = (id: any) => {
    // return `/booking/details?id=${id}`;
    console.log("id: ", id);
  };

  if (loading) return <LoadingScreen message="Loading..." />;
  return (
    <>
      {/* Show loading screen while image loads
      {isLoading && bookings && bookings.length > 0 && (
        <LoadingScreen message="Loading..." />
      )} */}
      {bookings && bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={({ item }) => (
            <UpcomingCard
              item={item}
              onPress={() => handleBookingDetails(item.$id)}
            />
          )}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          className={`${isLoading ? "opacity-0" : "opacity-100"} 
                    mt-2 bg-white rounded-3xl mx-4 shadow-sm`}
        >
          <View className="rounded-3xl overflow-hidden p-4">
            <Image
              source={funTravelPic}
              className="w-full h-48 mb-4"
              resizeMode="contain"
              fadeDuration={0}
              onLoadEnd={() => setIsLoading(false)}
            />
            <Text className="text-lg font-bold mb-1 text-black/70">
              No trips booked yet!
            </Text>
            <Text className="text-base text-gray-500">
              You haven't booked any trips yet. Start planning your next
              adventure!
            </Text>
            <TouchableOpacity
              className="bg-blue-300 rounded-xl mt-6 py-4 items-center"
              onPress={() => router.push("/")}
            >
              <Text className="text-white font-semibold">Book a trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default Upcoming;
