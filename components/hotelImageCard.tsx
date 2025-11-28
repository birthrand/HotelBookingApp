import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const HotelImageCard = ({
  image_url,
  selected,
  onPress,
}: {
  image_url: string;
  selected?: boolean;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} className="items-center">
      <View
        className={`relative rounded-2xl mt-2 overflow-hidden ${
          selected ? "w-[80px] h-[80px]" : "w-[70px] h-[70px]"
        }`}
      >
        <Image
          source={{ uri: image_url }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Dark overlay for non-selected images */}
        {!selected && <View className="absolute inset-0 bg-black/20" />}

        {/* Border for selected */}
        {selected && (
          <View className="absolute inset-0 border-2 border-white/80 rounded-2xl" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HotelImageCard;
