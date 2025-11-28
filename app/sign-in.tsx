import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import React from "react";
import { login } from "@/lib/appwrite";
import { Redirect } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import { SafeAreaView } from "react-native-safe-area-context";
import heroImage from "@/assets/images/heroImage.jpg";
import hero from "@/assets/images/hero.png";
import Hero from "@/assets/icons/icons";
import { LinearGradient } from "expo-linear-gradient";
import { clearDatabase, seed } from "@/lib/seed";

const seedData = async () => {
  await seed();
};

const clearData = async () => {
  await clearDatabase();
};

const SignIn = () => {
  const { refetch, loading, isLoggedIn } = useGlobalContext();

  if (!loading && isLoggedIn) {
    return <Redirect href="/" />;
  }

  const handleLogin = async () => {
    const result = await login();

    if (result) {
      console.log("Login successful");
      refetch();
    } else {
      Alert.alert("Error", "Login failed");
    }
  };
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="items-center justify-center">
        {/* <Image source={} className="w-full h-4/6" resizeMode="contain" /> */}
        <Hero width={400} height={500} />
        <View className="items-center justify-center mt-10">
          <Text className="text-black/90 font-inter text-4xl font-bold ">
            Let's Find Your Sweet
          </Text>
          <Text className="text-black/90 font-inter mt-2 text-4xl font-bold">
            & Dream Place
          </Text>
          <View className="px-8 m-7">
            <Text className="text-blue-200 text-center font-inter text-base font-bold">
              Get the opportunity to stay in your dream place at an affordable
              price
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-blue-300 w-3/4 p-6 rounded-full items-center justify-center"
          onPress={handleLogin}
        >
          <Text className="text-white font-inter text-base font-bold">
            Sign In With Google
          </Text>
        </TouchableOpacity>
        {/* seed and clear data */}
        {/* <Button title="Seed Data" onPress={seedData} />
        <Button title="Clear Data" onPress={clearData} /> */}
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
