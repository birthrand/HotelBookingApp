import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { getHotelsById } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import HotelImageCard from "@/components/hotelImageCard";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Hotel() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [hotelData, setHotelData] = useState<any[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const { data: hotelDataResponse } = useAppwrite({
    fn: getHotelsById,
    params: { id: id! },
  });

  useEffect(() => {
    if (hotelDataResponse) setHotelData(hotelDataResponse);
  }, [hotelDataResponse]);

  useEffect(() => {
    if (hotelData?.[0]?.images?.length) {
      const primary =
        hotelData[0].images.find((img: any) => img.is_primary) ||
        hotelData[0].images[0];
      setPrimaryImage(primary.image_url);
    }
  }, [hotelData]);

  const sortedImages = [...(hotelData[0]?.images || [])].sort(
    (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
  );

  const handleImagePress = (image_url: string) => setPrimaryImage(image_url);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [SCREEN_HEIGHT * 0.55, SCREEN_HEIGHT * 0.35],
    extrapolate: "clamp",
  });

  const fadeTitle = scrollY.interpolate({
    inputRange: [100, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const hotel = hotelData[0];

  return (
    <View className="flex-1 bg-white">
      {/* Animated Hero Header */}
      <Animated.View
        style={{
          height: headerHeight,
          overflow: "hidden",
        }}
      >
        <ImageBackground
          source={{ uri: primaryImage }}
          resizeMode="cover"
          className="w-full h-full"
        >
          <View className="absolute inset-0 bg-black/45" />
          {/* Header Buttons */}
          <View className="flex-row items-center justify-between px-5 mt-16">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-3 bg-white/30 rounded-full"
            >
              <Feather name="chevron-left" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity className="p-3 bg-white/30 rounded-full">
              <Feather name="heart" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View className="absolute bottom-10 px-6">
            <Text className="text-white text-4xl font-bold drop-shadow-lg">
              {hotel?.hotelName}
            </Text>
            <Text className="text-white/80 mt-2 text-base w-4/5">
              {hotel?.address}, {hotel?.city}, {hotel?.country}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>

      {/* Floating Thumbnail Gallery */}
      <View className="absolute top-[52%] right-0">
        <FlatList
          data={sortedImages}
          renderItem={({ item }) => (
            <HotelImageCard
              selected={primaryImage === item.image_url}
              image_url={item.image_url}
              onPress={() => handleImagePress(item.image_url)}
            />
          )}
          keyExtractor={(item, i) => i.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Content Scroll */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 180 }}
        className="bg-white rounded-t-3xl -mt-6"
      >
        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-black/80 mb-2">About</Text>
          <Text className="text-base text-gray-500 leading-6">
            {hotel?.description ||
              "Escape to this luxurious getaway featuring breathtaking views, exceptional service, and world-class amenities."}
          </Text>

          <Text className="text-xl font-bold text-black/80 mt-10 mb-4">
            Rooms & Suites
          </Text>

          <FlatList
            data={hotel?.roomImageAndType || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
            renderItem={({ item }) => (
              <View className="w-60 bg-white rounded-3xl shadow-md">
                <Image
                  source={{ uri: item.roomImages?.[0]?.image_url }}
                  className="w-full h-36 rounded-t-3xl"
                />
                <View className="p-4">
                  <Text className="text-lg font-semibold text-black/80">
                    {item.type}
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    ${item.price_per_night}/night
                  </Text>
                </View>
              </View>
            )}
          />

          <Text className="text-xl font-bold text-black/80 mt-10 mb-4">
            Amenities
          </Text>
          <View className="flex-row flex-wrap gap-4">
            {["Free Wi-Fi", "Breakfast", "Pool", "Gym", "Parking"].map(
              (service, index) => (
                <View
                  key={index}
                  className="bg-blue-100/60 rounded-full px-4 py-2 flex-row items-center"
                >
                  <Feather name="check-circle" size={16} color="#3b82f6" />
                  <Text className="ml-2 text-blue-800 text-sm">{service}</Text>
                </View>
              )
            )}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Bottom Booking Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white/95 shadow-lg py-5 px-6 border-t border-gray-100 flex-row items-center justify-between">
        <View>
          <Text className="text-gray-500 text-sm">From</Text>
          <Text className="text-2xl font-bold text-black/80">
            ${hotel?.roomImageAndType?.[0]?.price_per_night || "120"}
            <Text className="text-sm text-gray-500"> /night</Text>
          </Text>
        </View>

        <TouchableOpacity
          className="bg-blue-500 px-8 py-4 rounded-full shadow-lg"
          onPress={() => router.push(`/booking/${id}`)}
        >
          <Text className="text-white font-semibold text-base">Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Animated Compact Title */}
      <Animated.View
        style={{
          opacity: fadeTitle,
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <Text className="text-lg font-bold text-white drop-shadow-md">
          {hotel?.hotelName}
        </Text>
      </Animated.View>
    </View>
  );
}
