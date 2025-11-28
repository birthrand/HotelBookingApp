import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

const AddGuest = () => {
  const [date, setDate] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    gender?: string;
  }>({});

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    // setShow(Platform.OS === "ios"); // keep visible on iOS
    if (selectedDate) setDate(selectedDate);
  };

  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const genders = ["Male", "Female"];

  const handleSelect = (gender: string) => {
    setSelectedGender(gender);
    setIsOpen(false); // close dropdown after selection
  }; // Check form validity whenever name or gender changes
  useEffect(() => {
    const valid =
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      selectedGender !== null;
    setIsFormValid(valid);
  }, [firstName, lastName, selectedGender]);

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!selectedGender) newErrors.gender = "Gender is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (middleName.trim()) {
        console.log("Form submitted:", {
          firstName,
          middleName,
          lastName,
          selectedGender,
          birthdate: date.toDateString(),
        });
      } else {
        console.log("Form submitted:", {
          firstName,
          lastName,
          selectedGender,
          birthdate: date.toDateString(),
        });
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 pb-2 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color="gray" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-medium text-gray-600">
          New Guest
        </Text>
        <View className="w-8" />
      </View>
      <View className="border-t border-gray-200"></View>
      <View className="bg-gray-50 flex-row items-center justify-between px-4">
        <Text className="text-gray-400 text-sm my-2">
          Remember that a valid ID matching the guest details {"\n"}is required
          for check-in.
        </Text>
        <Feather
          name="alert-triangle"
          size={20}
          color="#6B7280"
          className="ml-0"
        />
      </View>
      <View className="px-4">
        <Text className="text-gray-400 font-medium mt-8 mb-2">First Name</Text>
        <TextInput
          className="bg-blue-100 rounded-lg p-4"
          value={firstName}
          onChangeText={setFirstName}
        />
        {errors.firstName && (
          <Text className="text-red-500 mb-2">{errors.firstName}</Text>
        )}
      </View>
      <View className="px-4">
        <Text className="text-gray-400 font-medium mt-8 mb-2">
          Middle Name (Optional)
        </Text>
        <TextInput
          className="bg-blue-100 rounded-lg p-4"
          value={middleName}
          onChangeText={setMiddleName}
        />
      </View>
      <View className="px-4">
        <Text className="text-gray-400 font-medium mt-8 mb-2">Last Name</Text>
        <TextInput
          className="bg-blue-100 rounded-lg p-4"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <View className="px-4">
        <Text className="text-gray-400 font-medium mt-8 mb-2">Birthdate</Text>
        <TextInput
          // placeholder="Select date"
          value={date.toDateString()}
          editable={false}
          onPressIn={() => setShow(true)}
          className="bg-blue-100 p-4 rounded-lg"
        />

        {show && (
          <View className="items-center mt-2">
            <DateTimePicker
              value={date}
              mode="date"
              display="default" // spinner mode allows textColor
              textColor="#000"
              onChange={onChange}
            />
          </View>
        )}

        {/* <Text className="mt-2 text-gray-700">
          Selected: {date.toDateString()}
        </Text> */}
      </View>

      <View className="px-4">
        <Text className="text-gray-400 font-medium mt-8 mb-2">Gender</Text>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsOpen(!isOpen)}
          className="flex-row items-center justify-between rounded-lg p-4  bg-blue-100"
        >
          <Text
            className={`${selectedGender ? "text-gray-800 " : "text-gray-400"}`}
          >
            {selectedGender || "Select gender"}
          </Text>
          <Feather
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
        {/* Dropdown List */}
        {isOpen && (
          <View className="border border-t-0 border-gray-200 rounded-b-lg bg-white overflow-hidden shadow-md">
            {genders.map((gender) => (
              <TouchableOpacity
                key={gender}
                onPress={() => handleSelect(gender)}
                className="border-b p-1 border-gray-200"
              >
                {selectedGender === gender ? (
                  <View className="p-3 bg-blue-200 rounded-md">
                    <Text className="text-white">{gender}</Text>
                  </View>
                ) : (
                  <View className="p-3 bg-white rounded-md">
                    <Text className="text-gray-600">{gender}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <View className="px-4 absolute bottom-10 w-full">
        <TouchableOpacity
          className={`${
            isFormValid ? "bg-blue-600" : "bg-gray-400"
          } "bg-blue-300 rounded-lg p-4 w-full"`}
          disabled={!isFormValid}
          onPress={handleSubmit}
        >
          <Text className="text-white text-center text-lg font-medium">
            Add Guest
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddGuest;
