import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import travel from "@/assets/images/travel.jpg";
import FeaturedCards from "@/components/featuredCards";
import HotelCards from "@/components/hotelCards";
import { useAppwrite } from "@/lib/useAppwrite";
import { getLatestHotels, getDestinations } from "@/lib/appwrite";
import LoadingScreen from "@/components/loadingScreen";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  const { data: featuredHotels, loading } = useAppwrite({
    fn: getLatestHotels,
  });
  const { data: destinations, loading: destinationsLoading } = useAppwrite({
    fn: getDestinations,
  });

  const [query, setQuery] = useState("");

  const handlePress = (id: string) => router.push(`/hotels/${id}`);

  return (
    <View className="flex-1 bg-white">
      <ImageBackground
        source={travel}
        className="w-full h-80 justify-end"
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
        imageStyle={{ resizeMode: "cover" }}
      >
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/45" />
        <View className="px-6 pb-8">
          <Text className="text-white text-4xl font-bold tracking-tight">
            Find your stay
          </Text>
          <Text className="text-gray-200 text-base mt-2">
            Luxury. Comfort. Adventure.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/search/find")}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center bg-white/15 backdrop-blur-md rounded-full mt-6 px-4 py-3">
              <Feather name="search" size={20} color="white" />
              <Text className="ml-3 flex-1 text-gray-300 text-base">
                Search hotels, cities or destinations...
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Scrollable Content */}
      <ScrollView
        className="-mt-4 bg-white rounded-t-3xl shadow-lg"
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Section */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-3 px-6">
            <Text className="text-2xl font-semibold text-black/80 ">
              Featured Hotels
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-300 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={featuredHotels}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <FeaturedCards
                item={item}
                onPress={() => handlePress(item.$id)}
              />
            )}
            // contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
            contentContainerClassName="gap-4 px-6"
          />
        </View>

        {/* Explore Section */}
        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-3 px-6">
            <Text className="text-2xl font-semibold text-black/80">
              Explore Destinations
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-300 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          {/* <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[1, 2, 3, 4, 5]}
            keyExtractor={(i) => i.toString()}
            renderItem={({ item }) => <HotelCards key={item} />}
            // contentContainerStyle={{ gap: 16 }}
            contentContainerClassName="gap-4 px-6"
          /> */}
          {destinationsLoading ? (
            <View className="h-40 items-center justify-center">
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={destinations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <HotelCards
                  city={item.city}
                  image={item.image}
                  onPress={() => handlePress(item.id)}
                />
              )}
              // contentContainerStyle={{ paddingHorizontal: 24 }}
              contentContainerClassName="gap-2 px-6"
            />
          )}
        </View>

        {/* Inspiration Section */}
        {/* <View className="mt-10 px-6 mb-10">
          <Text className="text-2xl font-semibold text-black/80 mb-3">
            Find Inspiration
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {[
              {
                title: "Beach Escapes",
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
              },
              {
                title: "Mountain Lodges",
                img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
              },
              {
                title: "City Lights",
                img: "https://images.unsplash.com/photo-1486308510493-aa64833634ef",
              },
              {
                title: "Tropical Paradise",
                img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
              },
            ].map((c) => (
              <TouchableOpacity
                key={c.title}
                className="w-[48%] mb-4 rounded-2xl overflow-hidden"
              >
                <Image source={{ uri: c.img }} className="h-32 w-full" />
                <View className="absolute inset-0 bg-black/30 justify-center items-center">
                  <Text className="text-white text-lg font-semibold">
                    {c.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}
      </ScrollView>
      {/* Loading Screen Overlay - Absolute Position */}

      {imageLoading && (
        <View className="absolute inset-0 bg-white z-50">
          <LoadingScreen />
        </View>
      )}
    </View>
  );
}
