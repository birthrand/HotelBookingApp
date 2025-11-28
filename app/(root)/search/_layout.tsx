import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="find"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="editGuests"
        options={{
          presentation: "pageSheet",
          headerShown: false,
          gestureEnabled: true,
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="chooseDates"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
