import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import { useRoom } from "@/lib/RoomContext";
import { useHotel } from "@/lib/HotelContext";
import { useCheckInAndOut } from "@/lib/CheckInAndOut";
import { useDate } from "@/lib/DateContext";
import { useGuest } from "@/lib/GuestContext";
import { useBooking } from "@/lib/BookingContext";
import { createBooking } from "@/lib/appwrite";

const BookingConfirm = () => {
  //   const { user } = useGlobalContext();
  const { selectedRoom } = useRoom();
  const { selectedHotel } = useHotel();
  const { checkInDate, setCheckInDate, checkOutDate, setCheckOutDate } =
    useCheckInAndOut();
  const { dateRange, getDateSummary } = useDate();
  const { guestInfo, getGuestSummary } = useGuest();
  const { bookingInfo, updateBookingInfo, clearBookingInfo } = useBooking();
  const formatDate = (d: Date | null) =>
    d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
  const checkInAndOutLabel =
    bookingInfo.check_in_date && bookingInfo.check_out_date
      ? `${formatDate(new Date(bookingInfo.check_in_date))} — ${formatDate(
          new Date(bookingInfo.check_out_date)
        )}`
      : "";

  const totalGuests = guestInfo.adults + guestInfo.children;
  // console.log("Selected Hotel:", selectedHotel);
  // console.log("Selected Room:", selectedRoom);
  const handleCreateBooking = async () => {
    try {
      const booking = await createBooking({
        userId: bookingInfo.user_id,
        hotelId: bookingInfo.hotel_id,
        checkInDate: new Date(bookingInfo.check_in_date).toISOString(),
        checkOutDate: new Date(bookingInfo.check_out_date).toISOString(),
        roomId: bookingInfo.room_id,
        numberOfGuests: totalGuests,
        totalPrice: bookingInfo.total_price,
        status: "pending",
      });
      console.log("Booking created:", booking);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handleContinue = () => {
    console.log("Continue");
    handleCreateBooking();
    router.push("/payment/paymentMethod");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="flex-row items-center px-4 py-2 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={28} color="gray" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-medium text-gray-600">
            Review Details
          </Text>
        </View>
        <View>
          <View className="flex-row items-start justify-start gap-4 px-8 py-6">
            <Image
              source={{ uri: selectedRoom?.images?.[0].image_url }}
              className="w-24 h-24 rounded-2xl"
              resizeMode="cover"
            ></Image>
            <View className="mt-1">
              <Text className="text-lg font-medium text-gray-600">
                {selectedHotel?.hotelName}, {selectedHotel?.city}
              </Text>
              <Text className="mt-1 text-gray-400">
                {selectedHotel?.address}, {selectedHotel?.city},{" "}
                {selectedHotel?.country}
              </Text>
              <Text className="mt-4 text-gray-600 font-medium">
                Total: ${bookingInfo.total_price}
              </Text>
            </View>
          </View>
        </View>
        <View className="bg-white border-b border-gray-200 mx-8"></View>
        <View className="px-8 mt-4">
          <Text className="mt-1 text-gray-600 font-medium">Selected Dates</Text>
          <Text className="mt-2 text-gray-400">{checkInAndOutLabel}</Text>
        </View>
        <View className="px-8 mt-4">
          <Text className="mt-1 text-gray-600 font-medium">Guests</Text>
          <Text className="mt-2 text-gray-400">
            {guestInfo.adults} {guestInfo.adults > 1 ? "Adults" : "Adult"}
            {guestInfo.children > 0 &&
              `, ${guestInfo.children} ${
                guestInfo.children > 1 ? "Children" : "Child"
              }`}
            {guestInfo.pets > 0 &&
              `, ${guestInfo.pets} ${guestInfo.pets > 0 ? "Pet-friendly" : ""}`}
          </Text>
        </View>
        <View className="px-8 mt-4">
          <Text className="mt-1 text-gray-600 font-medium">Selected Room</Text>
          <Text className="mt-2 text-gray-400">{selectedRoom?.type}</Text>
        </View>
      </View>
      <View className="px-4 my-2 border-t-2 border-gray-300 py-4">
        <TouchableOpacity
          onPress={handleContinue}
          className="rounded-2xl items-center justify-center px-6 py-5 bg-blue-300"
        >
          <Text className="text-white font-semibold text-lg">
            Continue to Payment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookingConfirm;
