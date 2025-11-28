import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import travel from "../../../assets/images/travel.jpg";
import Feather from "@expo/vector-icons/Feather";
import { useGlobalContext } from "@/lib/global-provider";
import { logout } from "@/lib/appwrite";
import { router } from "expo-router";
import { avatar } from "@/lib/appwrite";

const settings = [
  {
    title: "Edit Profile",
    icon: "user",
  },
  {
    title: "Payment Methods",
    icon: "credit-card",
  },
  {
    title: "Security",
    icon: "lock",
  },
  {
    title: "Notifications",
    icon: "bell",
  },
  {
    title: "Help & Support",
    icon: "help-circle",
  },
];

const SettingsItem = ({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center justify-start gap-4">
          <Feather name={icon as any} size={24} color="gray" />
          <Text className="text-black/80">{title}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="gray" />
      </View>
    </TouchableOpacity>
  );
};

const Profile = () => {
  const { user, refetch } = useGlobalContext();

  const handleLogout = async () => {
    const result = await logout();

    if (result) {
      Alert.alert("Logout successful");
      refetch();
    } else {
      Alert.alert("Logout failed");
    }
  };

  const handleNavigate = (title: string) => {
    if (title === "Edit Profile") {
      router.push("/profile/edit");
    }
  };

  return (
    <SafeAreaView className="flex-1 mx-4">
      <Text className="mt-4 text-3xl text-black/80 font-medium">Profile</Text>
      <View className="mt-12 flex-row items-center justify-between">
        <View className="flex-row items-center justify-start gap-6">
          {/* <Image
            source={{ uri: user?.avatar }}
            className="size-[70px] rounded-full"
          /> */}
          <View className="size-[70px] border-2 border-blue-300 rounded-full items-center justify-center">
            <Text className="text-blue-300 text-lg font-bold">
              {user?.avatar}
            </Text>
          </View>
          <View className="flex-col items-start justify-center">
            <Text className="text-black/80 text-xl font-medium">
              {user?.full_name}
            </Text>
            <Text className="text-black/80 font-medium">Show profile</Text>
          </View>
        </View>
        <View>
          <Feather name="chevron-right" size={28} color="gray" />
        </View>
      </View>
      <View className="mt-6 border-t-2 border-gray-200 mx-2"></View>
      <View className="mt-7 flex-row bg-white/90 shadow-sm items-center justify-between border border-gray-200 rounded-2xl px-4 py-8">
        <View className="flex flex-col items-start justify-center">
          <Text className="text-black/80 text-xl font-semibold">
            Your Perfect Stay
          </Text>
          <Text className="text-black/80 mt-2">
            It's simple and easy to book your stay
          </Text>
        </View>
        <Image source={travel} className="size-[60px] rounded-2xl" />
      </View>
      <Text className="mt-10 text-2xl text-black/80 font-medium">Settings</Text>
      <FlatList
        data={settings}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="mt-8"
        renderItem={({ item }) => (
          <SettingsItem
            title={item.title}
            icon={item.icon}
            onPress={() => handleNavigate(item.title)}
          />
        )}
        ItemSeparatorComponent={() => (
          <View className="border border-gray-200 my-5 w-full"></View>
        )}
      ></FlatList>
      <View className="border border-gray-200 w-full"></View>

      <TouchableOpacity className="mt-5 mb-2" onPress={handleLogout}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center justify-start gap-4">
            <Feather name="log-out" size={24} color="gray" />
            <Text className="text-danger font-medium">Logout</Text>
          </View>
          <Feather name="chevron-right" size={24} color="gray" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
