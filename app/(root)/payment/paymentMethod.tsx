import { View, Text, FlatList, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import visa from "@/assets/images/visa.png";
import mastercard from "@/assets/images/mastercard.png";
import paypal from "@/assets/images/paypal.png";
import { getLastBookingByUserId } from "@/lib/appwrite";
import { updateBookingStatus } from "@/lib/appwrite";
import { createPayment } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [disabled, setDisabled] = useState(false);
  const { user } = useGlobalContext();

  const { data: booking } = useAppwrite({
    fn: getLastBookingByUserId,
    params: { userId: user?.$id! },
  });

  const paymentMethods = [
    {
      id: 1,
      name: "Visa Card",
      icon: visa,
    },
    {
      id: 2,
      name: "Master Card",
      icon: mastercard,
    },
    {
      id: 3,
      name: "PayPal",
      icon: paypal,
    },
  ];

  const handleSelectMethod = (id: number) => {
    if (selectedMethod === id) {
      setSelectedMethod(null);
    } else {
      setSelectedMethod(id);
      const method = paymentMethods.find((method) => method.id === id);
      console.log("selectedMethod id: ", id);
      console.log("paymentMethod Name: ", method?.name);
    }
  };

  const handleCreatePayment = async () => {
    if (selectedMethod === null) return;
    const method = paymentMethods.find((m) => m.id === selectedMethod);
    if (!method) return;
    try {
      await createPayment({
        userId: user?.$id!,
        bookingId: booking?.$id!,
        paymentMethod: method.name,
        paymentStatus: "successful",
        paymentAmount: booking?.total_price!,
      });
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleContinue = () => {
    const method = paymentMethods.find((m) => m.id === selectedMethod);
    console.log("selectedMethod id: ", selectedMethod);
    console.log("paymentMethod Name: ", method?.name);
    if (selectedMethod !== null && method) {
      updateBookingStatus(booking?.$id!, "active");
      handleCreatePayment();
      router.push("/booking/success");
    } else {
      Alert.alert("Please select a payment method");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 flex">
        <View className="flex-row items-center py-2 bg-white border-b border-gray-200 ">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={28} color="gray" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-medium text-gray-600">
            Payment
          </Text>
        </View>
      </View>
      <View className="mt-8 px-4">
        <Text className="text-gray-600 text-xl font-medium">
          Choose a method
        </Text>
        <FlatList
          data={paymentMethods}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`flex-row items-center py-8 px-4 rounded-lg gap-2 ${
                selectedMethod === item.id
                  ? "border-2 border-blue-500"
                  : "border border-gray-200"
              }`}
              onPress={() => handleSelectMethod(item.id)}
            >
              <Image source={item.icon} className="w-10 h-10" />
              <Text className="text-gray-600 text-xl font-medium">
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="gap-4 mt-4"
          bounces={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View className="px-4 py-8 ">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={selectedMethod === null}
          className={`rounded-2xl items-center py-5 bg-blue-300 ${
            selectedMethod === null ? "opacity-50" : ""
          }`}
        >
          <Text
            className={`text-white font-semibold text-lg ${
              selectedMethod === null ? "opacity-50" : ""
            }`}
          >
            Continue to Payment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default PaymentMethod;
