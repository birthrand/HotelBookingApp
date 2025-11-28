import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getHotels } from "@/lib/appwrite";
import { useGuest } from "@/lib/GuestContext";
import { useDate } from "@/lib/DateContext";

const categories = ["All", "Luxury", "Budget", "Beach", "Mountain", "City"];

const SearchResultCard = ({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View
      className="mb-4 min-h-[208px]"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <TouchableOpacity
        className="mb-4 rounded-2xl overflow-hidden bg-white"
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View className="h-40">
          <ImageBackground
            source={{ uri: item.primaryImage }}
            className="w-full h-full"
            resizeMode="cover"
            onLoad={() => setImageLoading(false)}
          >
            {imageLoading && (
              <View className="absolute inset-0 items-center justify-center bg-gray-200">
                <ActivityIndicator size="small" color="#2563EB" />
              </View>
            )}

            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "transparent"]}
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

            <View className="absolute bottom-3 left-3 right-3">
              <Text className="text-white text-lg font-bold" numberOfLines={1}>
                {item.hotelName}
              </Text>
              <View className="flex-row items-center">
                <Feather name="map-pin" size={12} color="#E5E7EB" />
                <Text className="text-gray-200 text-sm ml-1" numberOfLines={1}>
                  {item.city}, {item.country}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View className="p-4 bg-white flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Feather name="star" size={14} color="#FBBF24" fill="#FBBF24" />
            <Text className="text-gray-700 font-semibold ml-1 text-sm">
              {item.rating || "N/A"}
            </Text>
          </View>
          <View className="flex-row items-baseline">
            <Text className="text-blue-600 font-bold text-lg">
              ${item.price}
            </Text>
            <Text className="text-gray-500 text-xs">/night</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { guestInfo } = useGuest();
  const { dateRange, getDateSummary } = useDate();
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch hotels when debounced query or category changes
  useEffect(() => {
    const fetchHotels = async () => {
      if (debouncedQuery.trim().length === 0 && selectedCategory === "All") {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await getHotels({
          filter: selectedCategory,
          query: debouncedQuery,
          limit: 20,
        });
        setSearchResults(results);
        setHasSearched(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchHotels();
  }, [debouncedQuery, selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleHotelPress = (id: string) => {
    router.push(`/hotels/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="bg-white px-4 pb-4 border-b border-gray-100">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            Find Your Stay
          </Text>
          <View className="w-10" />
        </View>

        {/* Guest & Date Cards Container */}
        <View className="flex-row gap-2 mb-3">
          {/* Date Selection Card */}
          <TouchableOpacity
            onPress={() => router.push("/search/chooseDates")}
            className="flex-1 bg-blue-50 border border-blue-200 rounded-2xl p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center justify-center">
                <Feather name="calendar" size={18} color="#4C4DDC" />
                <Text className="text-sm ml-1 text-gray-500">When</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#4C4DDC" />
            </View>
            <Text
              className="text-base font-semibold text-gray-700"
              numberOfLines={1}
            >
              {dateRange.startDate && dateRange.endDate
                ? getDateSummary()
                : "Add dates"}
            </Text>
          </TouchableOpacity>

          {/* Guest Selection Card */}
          <TouchableOpacity
            onPress={() => router.push("/search/editGuests")}
            className="flex-1 bg-green-50 border border-green-200 rounded-2xl p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center justify-center">
                <Feather name="users" size={18} color="#10B981" />
                <Text className="text-sm ml-1 text-gray-500">Who</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#10B981" />
            </View>
            <Text
              className="text-base font-semibold text-gray-700"
              numberOfLines={1}
            >
              {guestInfo.rooms} room, {guestInfo.adults + guestInfo.children}{" "}
              guest{guestInfo.adults + guestInfo.children !== 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-gray-100 border border-gray-300 rounded-2xl px-4 py-3.5 flex-row items-center">
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search destinations..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ padding: 0, lineHeight: 20, fontSize: 16 }}
            className="ml-3 flex-1 text-gray-800 text-base"
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Feather name="x-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      <View className="flex-1">
        {isSearching ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-500 mt-4">Searching...</Text>
          </View>
        ) : hasSearched && searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <SearchResultCard
                item={item}
                onPress={() => handleHotelPress(item.$id)}
              />
            )}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text className="text-gray-600 mb-4">
                {searchResults.length}{" "}
                {searchResults.length === 1 ? "result" : "results"} found
              </Text>
            }
          />
        ) : hasSearched && searchResults.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <View className="bg-gray-100 rounded-full p-8 mb-6">
              <Feather name="search" size={64} color="#D1D5DB" />
            </View>
            <Text className="text-2xl font-semibold text-black/80 mb-2">
              No results found
            </Text>
            <Text className="text-gray-500 text-center">
              Try adjusting your search or filters to find what you're looking
              for
            </Text>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <View className="bg-blue-50 rounded-full p-8 mb-6">
              <Feather name="search" size={64} color="#4C4DDC" />
            </View>
            <Text className="text-2xl font-semibold text-black/80 mb-2">
              Search for Hotels
            </Text>
            <Text className="text-gray-500 text-center mb-8">
              Find your perfect stay by searching for hotels, cities, or
              destinations
            </Text>

            {/* Popular Searches */}
            <View className="w-full">
              <Text className="text-gray-700 font-semibold mb-3">
                Try searching for:
              </Text>
              {["Luxury", "Beach", "City", "Mountain"].map((term) => (
                <TouchableOpacity
                  key={term}
                  onPress={() => setSearchQuery(term)}
                  className="flex-row items-center py-3 border-b border-gray-100"
                >
                  <Feather name="trending-up" size={18} color="#6B7280" />
                  <Text className="ml-3 text-gray-700 flex-1">{term}</Text>
                  <Feather name="arrow-up-right" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;
