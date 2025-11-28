import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import LoadingScreen from "@/components/loadingScreen";
import { useWishlist } from "@/lib/WishlistContext";
import {
  getWishlist,
  toggleWishlist,
  removeWishlist,
  addWishlist,
} from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { getHotelsById } from "@/lib/appwrite";

const WishlistCard = ({
  item,
  onRemove,
  onPress,
}: {
  item: any;
  onRemove: (id: string) => void;
  onPress: () => void;
}) => {
  return (
    <View className="shadow-sm">
      <TouchableOpacity
        className="mb-4 rounded-2xl overflow-hidden bg-white"
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View className="h-48">
          <ImageBackground
            source={{ uri: item.primaryImage }}
            className="w-full h-full"
          >
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

            {/* Heart Icon */}
            <TouchableOpacity
              className="absolute top-3 right-3 bg-white/90 rounded-full p-2"
              onPress={onPress}
            >
              <Feather name="heart" size={20} color="#EF4444" fill="#EF4444" />
            </TouchableOpacity>

            {/* Hotel Info Overlay */}
            <View className="absolute bottom-3 left-3 right-3">
              <Text className="text-white text-xl font-bold">
                {item.hotelName}
              </Text>
              <View className="flex-row items-center mt-1">
                <Feather name="map-pin" size={14} color="#E5E7EB" />
                <Text className="text-gray-200 text-sm ml-1">
                  {item.city}, {item.country}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Bottom Info Section */}
        <View className="p-4 flex-row items-center justify-between bg-white">
          <View className="flex-row items-center">
            <Feather name="star" size={16} color="#FBBF24" fill="#FBBF24" />
            <Text className="text-gray-700 font-semibold ml-1">
              {item.rating}
            </Text>
          </View>
          <View className="flex-row items-baseline">
            <Text className="text-blue-300 font-bold text-lg">
              ${item.price}
            </Text>
            <Text className="text-gray-500 text-sm">/night</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Wishlist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { wishlist, toggleWishlistHandler, refreshWishlist } = useWishlist();
  const { user } = useGlobalContext();

  const { data: wishData, refetch } = useAppwrite({
    fn: getWishlist,
    params: {
      userId: (user?.$id as string) || "",
    },
  });

  console.log("wishData:", wishData);
  // const { data: hotelData } = useAppwrite({
  //   fn: getHotelsById,
  //   params: {
  //     id: wishlist?.[0] as string,
  //   },
  // });
  // console.log("hotelData:", hotelData);
  // console.log("wishData:", wishData);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      // Your API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Show loading screen while data is being fetched
  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleRemove = (id: string) => {
    // setWishlistData((prev) => prev.filter((item) => item.id !== id));
    console.log("removing wishlist:", id);
    toggleWishlistHandler(id);
    refetch();
  };

  const handlePress = (id: string) => {
    router.push(`/hotels/${id}`);
  };

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium text-gray-600">My Wishlist</Text>
          <Text className="text-gray-500 text-sm">
            {wishData?.length}{" "}
            {wishData?.length && wishData?.length === 1 ? "hotel" : "hotels"}{" "}
            saved
          </Text>
        </View>
      </View>

      {/* Wishlist Content */}
      {wishData?.length && wishData?.length > 0 ? (
        <FlatList
          data={wishData}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <WishlistCard
              item={item}
              onRemove={handleRemove}
              onPress={() => handlePress(item.$id)}
            />
          )}
          contentContainerClassName="px-6 pb-6 mt-4"
          showsVerticalScrollIndicator={false}
        />
      ) : (
        // Empty State
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-gray-100 rounded-full p-8 mb-6">
            <Feather name="heart" size={64} color="#D1D5DB" />
          </View>
          <Text className="text-2xl font-semibold text-black/80 mb-2">
            No favorites yet
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Start exploring and save your favorite hotels to your wishlist
          </Text>
          <TouchableOpacity
            className="bg-blue-600 px-8 py-4 rounded-xl"
            onPress={() => router.push("/")}
          >
            <Text className="text-white font-semibold text-base">
              Explore Hotels
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Wishlist;
