import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

const TabIcon = ({
  title,
  icon,
  focused,
}: {
  title: string;
  icon: string;
  focused: boolean;
}) => {
  return (
    <View className="flex flex-col items-center mt-3">
      <Feather
        name={icon as any}
        size={24}
        color={focused ? "#4C4DDC" : "#6B7280"}
        // tintColor
      />
      <Text
        className={`${
          focused ? "text-blue-300" : "text-gray-500"
        } text-xs w-full font-medium`}
      >
        {title}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          minHeight: 56,
          //   position: "absolute",
          flexDirection: "row",
          justifyContent: "space-around",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title="Search" icon="search" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: "Booking",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title="Booking" icon="calendar" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title="Wishlist" icon="heart" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title="Profile" icon="user" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
