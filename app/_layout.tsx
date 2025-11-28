import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import GlobalProvider from "@/lib/global-provider";
import "../global.css";
import { RoomProvider } from "@/lib/RoomContext";
import { HotelProvider } from "@/lib/HotelContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CheckInAndOutProvider } from "@/lib/CheckInAndOut";
import { WishlistProvider } from "@/lib/WishlistContext";
import { GuestProvider } from "@/lib/GuestContext";
import { DateProvider } from "@/lib/DateContext";
import { BookingProvider } from "@/lib/BookingContext";
export default function RootLayout() {
  // const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       // Keep splash visible while we prepare resources
  //       await SplashScreen.preventAutoHideAsync();

  //       // Simulate small delay (e.g., fetching user data)
  //       await new Promise((resolve) => setTimeout(resolve, 500));

  //       setIsReady(true);
  //     } catch (e) {
  //       console.warn(e);
  //     } finally {
  //       // Hide splash once ready
  //       await SplashScreen.hideAsync();
  //     }
  //   }

  //   prepare();
  // }, []);

  // if (!isReady) {
  //   return (
  //     <SafeAreaView className="bg-white h-full justify-center items-center">
  //       <ActivityIndicator size="large" color="#0ea5e9" />
  //     </SafeAreaView>
  //   );
  // }

  return (
    <GlobalProvider>
      <DateProvider>
        <HotelProvider>
          <CheckInAndOutProvider>
            <RoomProvider>
              <GuestProvider>
                <BookingProvider>
                  <WishlistProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                  </WishlistProvider>
                </BookingProvider>
              </GuestProvider>
            </RoomProvider>
          </CheckInAndOutProvider>
        </HotelProvider>
      </DateProvider>
    </GlobalProvider>
  );
}
