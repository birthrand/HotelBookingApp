import { View, Text, TouchableOpacity, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useGuest } from "@/lib/GuestContext";

const EditGuests = () => {
  const { guestInfo, updateGuestInfo } = useGuest();
  const [rooms, setRooms] = useState(guestInfo.rooms);
  const [adults, setAdults] = useState(guestInfo.adults);
  const [children, setChildren] = useState(guestInfo.children);
  const [pets, setPets] = useState(guestInfo.pets);
  const totalGuests = adults + children;

  //   useEffect(() => {
  //     setRooms(guestInfo.rooms);
  //     setAdults(guestInfo.adults);
  //     setChildren(guestInfo.children);
  //     setPets(guestInfo.pets);
  //   }, [guestInfo]);

  console.log(rooms, adults, children, pets);

  const handleIncrement = (type: "rooms" | "adults" | "children" | "pets") => {
    if (type === "rooms" && rooms < 3) setRooms(rooms + 1);
    if (type === "adults" && adults < 5) setAdults(adults + 1);
    if (type === "children" && children < 5) setChildren(children + 1);
    if (type === "pets" && pets < 1) setPets(pets + 1);
  };

  const handleDecrement = (type: "rooms" | "adults" | "children" | "pets") => {
    if (type === "rooms" && rooms > 1) setRooms(rooms - 1);
    if (type === "adults" && adults > 1) setAdults(adults - 1);
    if (type === "children" && children > 0) setChildren(children - 1);
    if (type === "pets" && pets > 0) setPets(pets - 1);
  };

  const handleApply = () => {
    // Pass the selected values back or store in context
    // console.log(guestInfo);
    updateGuestInfo({ rooms, adults, children, pets });
    console.log(guestInfo);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      {/* Header */}
      <View className=" mt-2 flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-semibold text-gray-600 mr-6">
          Edit Guests
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Rooms */}
        <View className="flex-row items-center justify-between py-8 border-b border-gray-200">
          <View>
            <Text className="text-lg font-medium text-gray-600">Rooms</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => handleDecrement("rooms")}
              disabled={rooms === 1}
              className={`w-6 h-6 rounded-full items-center justify-center border-2 border-gray-200
              `}
            >
              <Feather
                name="minus"
                size={16}
                color={rooms === 1 ? "#D1D5DB" : "#4C4DDC"}
              />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-600 w-10 px-2 py-1 bg-gray-100 rounded-xl text-center">
              {rooms}
            </Text>
            <TouchableOpacity
              onPress={() => handleIncrement("rooms")}
              disabled={rooms === 3}
              className={`w-6 h-6 rounded-full items-center justify-center border-2 border-gray-200
              `}
            >
              <Feather
                name="plus"
                size={16}
                color={rooms === 3 ? "#D1D5DB" : "#4C4DDC"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Adults */}
        <View className="flex-row items-center justify-between py-8 border-b border-gray-200">
          <View>
            <Text className="text-lg font-medium text-gray-600">Adults</Text>
            <Text className="text-sm text-gray-400">Age 18+</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => handleDecrement("adults")}
              disabled={adults === 1}
              className={`w-6 h-6 rounded-full items-center justify-center border-2 border-gray-200
              `}
            >
              <Feather
                name="minus"
                size={16}
                color={adults === 1 ? "#D1D5DB" : "#4C4DDC"}
              />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-600  w-10 px-2 py-1 bg-gray-100 rounded-xl text-center">
              {adults}
            </Text>
            <TouchableOpacity
              onPress={() => handleIncrement("adults")}
              disabled={totalGuests >= 5}
              className={`w-6 h-6 rounded-full items-center justify-center border-2 border-gray-200
              `}
            >
              <Feather
                name="plus"
                size={16}
                color={totalGuests >= 5 ? "#D1D5DB" : "#4C4DDC"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Children */}
        <View className="flex-row items-center justify-between py-8 border-b border-gray-200">
          <View>
            <Text className="text-lg font-medium text-gray-600">Children</Text>
            <Text className="text-sm text-gray-400">Age 0-17</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => handleDecrement("children")}
              disabled={children === 0}
              className={`w-6 h-6 rounded-full items-center justify-center border-2 border-gray-200
              `}
            >
              <Feather
                name="minus"
                size={16}
                color={children === 0 ? "#D1D5DB" : "#4C4DDC"}
              />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-600 w-10 px-2 py-1 bg-gray-100 rounded-xl text-center">
              {children}
            </Text>
            <TouchableOpacity
              onPress={() => handleIncrement("children")}
              disabled={totalGuests >= 5}
              className={`w-6 h-6 rounded-full items-center justify-center border-2 border-gray-200
              `}
            >
              <Feather
                name="plus"
                size={16}
                color={totalGuests >= 5 ? "#D1D5DB" : "#4C4DDC"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pets */}
        <View className="flex-row items-center justify-between py-8 border-b border-gray-200">
          <View>
            <Text className="text-lg font-medium text-gray-600">Pets</Text>
            <Text className="text-sm text-gray-400">Max 1 pet</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => handleDecrement("pets")}
              disabled={pets === 0}
              className={`w-6 h-6 rounded-full items-center justify-center border-2 border-gray-200
              `}
            >
              <Feather
                name="minus"
                size={16}
                color={pets === 0 ? "#D1D5DB" : "#4C4DDC"}
              />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-600 w-10 px-2 py-1 bg-gray-100 rounded-xl text-center">
              {pets}
            </Text>
            <TouchableOpacity
              onPress={() => handleIncrement("pets")}
              disabled={pets === 1}
              className={`w-6 h-6 rounded-full items-center justify-center border-2 border-gray-200
              `}
            >
              <Feather
                name="plus"
                size={16}
                color={pets === 1 ? "#D1D5DB" : "#4C4DDC"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Apply Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={handleApply}
          className="bg-blue-300 rounded-xl py-4 items-center"
        >
          <Text className="text-white font-semibold text-lg">Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditGuests;
