import { View, Text, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "" }: LoadingScreenProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    // Rotate animation
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Fade animation
    const fade = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    rotate.start();
    fade.start();

    return () => {
      pulse.stop();
      rotate.stop();
      fade.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 items-center justify-center">
        {/* Animated Icon Container */}
        <View className="relative items-center justify-center mb-8">
          {/* Outer rotating ring */}
          <Animated.View
            className="absolute w-32 h-32 rounded-full border-4 border-blue-100"
            style={{
              transform: [{ rotate: spin }],
            }}
          >
            <View className="absolute top-0 left-1/2 -ml-2 w-4 h-4 bg-blue-600 rounded-full" />
          </Animated.View>

          {/* Inner pulsing circle */}
          <Animated.View
            className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center"
            style={{
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Feather name="home" size={40} color="#2563EB" />
          </Animated.View>
        </View>

        {/* Loading Text with Fade */}
        <Animated.Text
          className="text-gray-700 text-lg font-semibold mb-2"
          style={{ opacity: fadeAnim }}
        >
          {message}
        </Animated.Text>

        {/* Animated Dots */}
        {/* <View className="flex-row items-center gap-2">
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              className="w-2 h-2 bg-blue-600 rounded-full"
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              }}
            />
          ))}
        </View> */}

        {/* Brand Text */}
        {/* <Text className="text-gray-400 text-sm mt-2">
          Finding your perfect stay...
        </Text> */}
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
