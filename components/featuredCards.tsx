import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import travel from "@/assets/images/travel.jpg";
import { router } from "expo-router";
import { Models } from "react-native-appwrite";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";

interface Props {
  item: Models.Document;
  onPress?: () => void;
}

const FeaturedCards = ({
  item: { primaryImage, hotelName, city, country, price },
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      className="w-[250px] h-[320px] rounded-3xl overflow-hidden relative"
      onPress={onPress}
    >
      <ImageBackground source={{ uri: primaryImage }} className="w-full h-full">
        <LinearGradient
          colors={["rgba(0,0,0,0.5)", "transparent"]}
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
        {/* <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50"></View> */}
        <View className="absolute bottom-4 left-4 right-4">
          <Text className="text-white text-lg font-bold" numberOfLines={1}>
            {hotelName}
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Feather name="map-pin" size={12} color="#E5E7EB" />
              <Text className="text-gray-200 text-sm ml-1" numberOfLines={1}>
                {city}, {country}
              </Text>
            </View>

            <View className="flex-row items-baseline ml-2">
              <Text className="text-white font-bold text-base">
                ${price?.toFixed(0)}
              </Text>
              <Text className="text-white/80 text-xs">/night</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default FeaturedCards;
