import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Upcoming from "../booking/upcoming";
import History from "../booking/history";

const Booking = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const tabs = ["Upcoming", "History"];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        <View className="flex-row items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
          <Text className="flex-1 text-center text-xl font-medium text-gray-600">
            All Trips
          </Text>
        </View>
        <View className="flex-row items-center justify-around gap-4 px-4 py-4 ">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity key={index} onPress={() => setActiveTab(tab)}>
                <Text
                  className={`text-base font-medium ${
                    isActive ? "text-blue-300" : "text-gray-500"
                  }`}
                >
                  {tab}
                </Text>
                {isActive && <View className="h-1 rounded-full bg-blue-300" />}
              </TouchableOpacity>
            );
          })}
        </View>
        {activeTab === "Upcoming" ? <Upcoming /> : <History />}
      </View>
    </SafeAreaView>
  );
};

export default Booking;
