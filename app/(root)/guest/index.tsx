import { View, Text, TouchableOpacity, Image, Touchable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";

const Guest = () => {
  const { user } = useGlobalContext();
  const [isSelected, setIsSelected] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(false);

  const toggleSelect = () => {
    setIsSelected(!isSelected);
  };

  const handleNewGuest = () => {
    router.push("/guest/new");
  };

  const handleContinue = () => {
    router.push("/booking/confirm");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-2 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color="gray" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-medium text-gray-600">
          Specify Primary Guest
        </Text>
        <View>
          <TouchableOpacity onPress={handleContinue} disabled={!isSelected}>
            <Text
              className={`font-semibold text-lg ${
                isSelected ? "text-blue-300" : "text-gray-300"
              }`}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="border-t border-gray-200"></View>
      <View className="bg-gray-50">
        <Text className="text-gray-500 text-base px-4 my-3">
          {" "}
          This reservation is for:
        </Text>
      </View>
      <View className="flex-row items-center justify-between px-4">
        <View className=" items-center justify-start flex-row my-3">
          {/* <Image
            source={{ uri: user?.avatar }}
            className="w-16 h-16 rounded-full border border-gray-200"
          /> */}
          <View className="w-16 h-16 border border-blue-300 rounded-full items-center justify-center">
            <Text className="text-gray-800 text-lg">{user?.avatar}</Text>
          </View>
          <View className="flex-col items-start ml-4">
            <Text className="text-gray-800 text-lg">{user?.full_name}</Text>
            <Text className="text-gray-500 text-base">
              {/* {user?.name} */}
              Adult
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className={` rounded-lg py-3 px-6 items-center justify-center ${
            isSelected ? "bg-green-500" : "transparent border-2 border-gray-300"
          } `}
          onPress={toggleSelect}
        >
          {isSelected ? (
            <Feather name="check" size={20} color="white" />
          ) : (
            <Text
              className={`font-medium ${
                isSelected ? "text-white" : "text-blue-300"
              }`}
            >
              {isSelected ? "" : "Select"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View className="border-t border-gray-200"></View>
      <TouchableOpacity
        className="px-4 items-center justify-start flex-row my-3"
        onPress={handleNewGuest}
      >
        <View
          className="w-16 h-16 border border-gray-300 rounded-full items-center justify-center"
          style={{ borderStyle: "dashed" }}
        >
          <Feather name="plus" size={20} color="gray" />
        </View>

        <Text className="text-gray-800 text-lg ml-4">New Guest</Text>
      </TouchableOpacity>
      <View className="border-t border-gray-200"></View>
    </SafeAreaView>
  );
};

export default Guest;
