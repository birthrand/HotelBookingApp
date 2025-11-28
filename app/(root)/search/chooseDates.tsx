import { View, Text, TouchableOpacity, Animated } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { DatePickerModal } from "react-native-paper-dates";
import { useDate } from "@/lib/DateContext";

const ChooseDates = () => {
  const [range, setRange] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  const { dateRange, updateDateRange } = useDate();

  const [open, setOpen] = useState(true);
  const slideAnim = useRef(new Animated.Value(100)).current;

  // Get date ranges
  const today = dateRange.startDate || new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 11);
  // Set to last day of that month
  maxDate.setMonth(maxDate.getMonth() + 1);
  maxDate.setDate(0);

  // Slide in button when both dates are selected
  useEffect(() => {
    if (range.startDate && range.endDate) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [range.startDate, range.endDate]);

  const onDismiss = () => {
    setRange(dateRange);
    setOpen(false);
  };

  const onConfirm = ({ startDate, endDate }: any) => {
    setOpen(false);
    setRange({ startDate, endDate });
  };

  const handleConfirmDates = () => {
    console.log("Selected dates:", range);
    // Save to context or pass back to previous screen
    updateDateRange(range);
    router.back();
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-semibold text-gray-800 mr-6">
          Select Dates
        </Text>
      </View>

      {/* Selected Dates Display */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row gap-3">
          {/* Check-in Date */}
          <TouchableOpacity
            onPress={() => setOpen(true)}
            className="flex-1 p-4 rounded-xl border-2 border-blue-300 bg-blue-50"
          >
            <Text className="text-xs text-gray-500 mb-1">Check-in</Text>
            <Text className="text-base font-semibold text-gray-800">
              {formatDate(range.startDate)}
            </Text>
          </TouchableOpacity>

          {/* Check-out Date */}
          <TouchableOpacity
            onPress={() => setOpen(true)}
            className="flex-1 p-4 rounded-xl border-2 border-green-400 bg-green-50"
          >
            <Text className="text-xs text-gray-500 mb-1">Check-out</Text>
            <Text className="text-base font-semibold text-gray-800">
              {formatDate(range.endDate)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Duration Display */}
        {range.startDate && range.endDate && (
          <View className="mt-4 p-3 bg-gray-100 rounded-xl">
            <Text className="text-sm text-gray-600 text-center">
              {(() => {
                const nights = Math.floor(
                  (range.endDate.getTime() - range.startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return `${nights} night${nights !== 1 ? "s" : ""}`;
              })()}
            </Text>
          </View>
        )}
      </View>

      {/* Instructions */}
      <View className="px-6 py-2">
        <Text className="text-sm text-gray-500 text-center">
          Tap on the calendar to select your check-in and check-out dates
        </Text>
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        locale="en"
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={dateRange.startDate || range.startDate}
        endDate={dateRange.endDate || range.endDate}
        onConfirm={onConfirm}
        validRange={{
          startDate: today,
          endDate: maxDate,
        }}
        saveLabel="Select"
        label="Select dates"
        startLabel="Check-in"
        endLabel="Check-out"
      />

      {/* Confirm Button - Slides in from bottom */}
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingBottom: 24,
          paddingTop: 12,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={handleConfirmDates}
          className="bg-blue-300 rounded-xl py-4 items-center"
          disabled={!range.startDate || !range.endDate}
        >
          <Text className="text-white font-semibold text-lg">
            Confirm Dates
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ChooseDates;
