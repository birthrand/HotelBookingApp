import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppwrite } from "@/lib/useAppwrite";
import { getHotelsById, getRoomsByHotelId } from "@/lib/appwrite";
import { useRoom } from "@/lib/RoomContext";
import { Button } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { useCheckInAndOut } from "@/lib/CheckInAndOut";
import { useDate } from "@/lib/DateContext";
import { useGuest } from "@/lib/GuestContext";
import { useBooking } from "@/lib/BookingContext";
import { useGlobalContext } from "@/lib/global-provider";
import { useHotel } from "@/lib/HotelContext";

const { width } = Dimensions.get("window");

const RoomsSelectionPage = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomDataList, setroomDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { setSelectedRoom } = useRoom();
  const { getGuestSummary, guestInfo } = useGuest();
  const { checkInDate, setCheckInDate, checkOutDate, setCheckOutDate } =
    useCheckInAndOut();
  const { dateRange, getDateSummary } = useDate();
  const { bookingInfo, updateBookingInfo, clearBookingInfo } = useBooking();
  const { user } = useGlobalContext();
  const { selectedHotel } = useHotel();
  const totalGuests = guestInfo.adults + guestInfo.children;

  const nights = Math.floor(
    (new Date(dateRange.endDate!).getTime() -
      new Date(dateRange.startDate!).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const { data: roomData } = useAppwrite({
    fn: getRoomsByHotelId,
    params: id ? { id } : undefined,
  });
  //   console.log("Hotel ID from rooms page:", id);
  //   console.log("Fetched rooms:", roomData);

  useEffect(() => {
    if (roomData?.length === 0) {
      <ActivityIndicator size="large" color="#0000ff" />;
    } else {
      setLoading(false);
    }
  }, [roomData]);

  const router = useRouter();

  const handleRoomSelect = (id: string) => {
    setSelectedRoomId(id);
  };

  const handleBack = () => {
    router.back();
  };

  const handleReserve = () => {
    if (!selectedRoomId) return;

    if (roomData?.length === 0) {
      return;
    } else {
      updateBookingInfo({
        user_id: user?.$id,
        hotel_id: selectedHotel?.$id,
        room_id: selectedRoomId,
        check_in_date: dateRange.startDate?.toISOString(),
        check_out_date: dateRange.endDate?.toISOString(),
        total_price:
          roomData?.find((room: any) => room.$id === selectedRoomId)
            ?.price_per_night * nights,
      });
      console.log(
        "Selected Room:",
        roomData?.find((room: any) => room.$id === selectedRoomId)
      );
      setSelectedRoom(
        roomData?.find((room: any) => room.$id === selectedRoomId)
      );
      router.push("/guest");
    }
    // setSelectedRoom(roomData?.find((room: any) => room.$id === selectedRoomId));
    // router.push("/guest");
    // router.push(`/rooms/${selectedRoomId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 pb-2 mb-1 bg-gray-50 border-b border-gray-200">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <Feather name="chevron-left" size={24} color="#1F2937" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/search/chooseDates`)}
          className=" py-2 px-4 bg-black/20 rounded-xl flex items-center justify-center"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-white text-sm font-medium">
              {getDateSummary()}
            </Text>
            <Feather name="edit" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <View className="w-8" />
      </View>

      <FlatList
        data={roomData}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}
        keyExtractor={(item) => item?.$id}
        // contentContainerStyle={{ padding: 16 }}
        contentContainerClassName="px-4 mt-2"
        renderItem={({ item }) => {
          const isSelected = selectedRoomId === item?.$id;
          return (
            <TouchableOpacity
              onPress={() => handleRoomSelect(item?.$id)}
              className={`bg-white rounded-2xl shadow-sm mb-4
                ${isSelected ? "border-2 border-blue-500" : ""}`}
            >
              <View className=" p-4 overflow-hidden rounded">
                <Image
                  source={{ uri: item?.images?.[0].image_url }}
                  className="w-full h-80 rounded-2xl"
                  resizeMode="cover"
                />
                <View className="absolute right-6 top-6 bg-green-600 px-2 py-1 rounded-2xl">
                  <Text className="ml-1 text-white text-sm">
                    {item?.status}
                  </Text>
                </View>
              </View>
              <View className="px-4 flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-800 font-semibold text-lg">
                    {item?.type}
                  </Text>
                  <View className="flex-row gap-2">
                    <View className="flex-row items-center justify-center py-1">
                      <Feather name="users" size={16} color="gray" />
                      <Text className="ml-1 text-gray-500 font-medium text-sm">
                        {totalGuests} {totalGuests > 1 ? "guests" : "guest"}
                      </Text>
                    </View>
                  </View>
                  <View className="mt-3 flex-row items-center justify-between"></View>
                </View>
              </View>
              <View className="border-t border-gray-200"></View>
              <View className="flex-row items-center justify-between px-4 my-6">
                <View>
                  <Text className="text-gray-800 font-semibold text-lg">
                    Total Price:
                  </Text>
                  <Text className="text-gray-500 font-medium text-sm">
                    for {nights} {nights > 1 ? "nights" : "night"}
                  </Text>
                </View>
                <Text className="text-gray font-semibold text-lg">
                  ${item.price_per_night * nights}
                </Text>
              </View>
              <View className="border-t border-gray-200"></View>

              <View className="px-4 my-4">
                <TouchableOpacity
                  onPress={handleReserve}
                  disabled={!isSelected}
                  className={`rounded-2xl items-center justify-center px-6 py-5 ${
                    isSelected ? "bg-blue-300" : "bg-gray-300"
                  }`}
                >
                  <Text className="text-white font-semibold text-lg">
                    Reserve
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* <View className="absolute bottom-0 left-0 right-0 bg-white p-6 shadow-lg "> */}
      {/* <Text className="text-gray-800 font-semibold text-lg">
          {roomData?.find((r) => r.$id === selectedRoomId)?.price_per_night}
          {selectedRoomId ? "/night" : ""}
        </Text> */}
    </SafeAreaView>
  );
};

export default RoomsSelectionPage;
