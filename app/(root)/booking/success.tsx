import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
const BookingSuccess = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-4">
        <View className="rounded-full bg-gray-100 p-4">
          <Feather name="check-circle" size={100} color="green" />
        </View>
        <Text className="mt-8 text-3xl font-bold text-black/80">
          Successful!
        </Text>
        <Text className="mt-8 px-4 text-center text-gray-500">
          Your payment was successful. To check your booking, please visit the
          booking page.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="mt-8 px-10 py-2 rounded-2xl items-center justify-center bg-blue-300"
        >
          <Text className="text-white font-semibold text-lg">Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookingSuccess;
