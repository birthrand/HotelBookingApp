import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import travel from "@/assets/images/travel.jpg";

interface HotelCardsProps {
  city: string;
  image: string;
  onPress: () => void;
}
const HotelCards = ({ city, image, onPress }: HotelCardsProps) => {
  return (
    <TouchableOpacity
      className="w-[140px] h-[140px] rounded-3xl overflow-hidden mr-2"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ImageBackground source={{ uri: image }} className="w-full h-full">
        <View className="absolute inset-0 bg-black/40 justify-center items-center">
          <Text className="text-white text-lg font-bold">{city}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default HotelCards;
