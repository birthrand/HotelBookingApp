import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { DatePickerInput } from "react-native-paper-dates";
import { useGlobalContext } from "@/lib/global-provider";
import { updateUser } from "@/lib/appwrite";

const EditProfile = () => {
  const [inputDate, setInputDate] = React.useState(undefined);
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
  const { user, refetch } = useGlobalContext();
  const [phoneNumber, setPhoneNumber] = useState("");
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
    console.log("user name", user?.name);
  }; // Check form validity whenever name or gender changes

  // Initialize form with user's current data
  useEffect(() => {
    if (user?.name) {
      const nameParts = user.name.trim().split(" ");

      if (nameParts.length === 1) {
        // Only first name
        setFirstName(nameParts[0]);
      } else if (nameParts.length === 2) {
        // First and last name
        setFirstName(nameParts[0]);
        setLastName(nameParts[1]);
      } else if (nameParts.length >= 3) {
        // First, middle(s), and last name
        setFirstName(nameParts[0]);
        setLastName(nameParts[nameParts.length - 1]);
        setMiddleName(nameParts.slice(1, -1).join(" "));
      }
    }
  }, [user]);

  useEffect(() => {
    const valid = firstName.trim().length > 0 && lastName.trim().length > 0;
    setIsFormValid(valid);
  }, [firstName, lastName, selectedGender]);
  const handleSubmit = async () => {
    console.log("user", user);
    if (user?.$id) {
      const userDocId = user?.$id;
      console.log("userDocId", userDocId);

      const newErrors: typeof errors = {};
      if (!firstName.trim()) newErrors.firstName = "First name is required";
      if (!lastName.trim()) newErrors.lastName = "Last name is required";
      //   if (!selectedGender) newErrors.gender = "Gender is required";

      setErrors(newErrors);

      console.log("keys", Object.keys(newErrors).length);
      if (Object.keys(newErrors).length === 0) {
        // if (!user) return;

        await updateUser(userDocId, {
          full_name: `${firstName} ${middleName} ${lastName}`,
          dateOfBirth: date.toDateString(),
          phone: phoneNumber,
        });
        await refetch();
        alert("Saved successfully");
        router.replace("/profile");
      }
    }

    if (!user?.$id) return;
  };

  const handleBack = () => {
    router.replace("/profile");
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View className="flex-row items-center px-4 pb-2 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={handleBack}>
            <Feather name="chevron-left" size={28} color="gray" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-medium text-gray-600">
            Edit Profile
          </Text>
          <View className="w-8" />
        </View>
        <View className="border-t border-gray-200"></View>
        <View className="bg-gray-50 flex-row items-center justify-between px-4">
          <Text className="text-gray-400 text-sm my-2">
            Remember that a valid ID matching the guest details {"\n"}is
            required for check-in.
          </Text>
          <Feather
            name="alert-triangle"
            size={20}
            color="#6B7280"
            className="ml-0"
          />
        </View>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            // scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="flex-1"
          >
            <View className="px-4">
              <Text className="text-gray-400 font-medium mt-8 mb-2">
                First Name
              </Text>
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
                Middle Name (optional)
              </Text>
              <TextInput
                className="bg-blue-100 rounded-lg p-4"
                value={middleName}
                onChangeText={setMiddleName}
              />
            </View>
            <View className="px-4">
              <Text className="text-gray-400 font-medium mt-8 mb-2">
                Last Name
              </Text>
              <TextInput
                className="bg-blue-100 rounded-lg p-4"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
            <View className="px-4">
              <Text className="text-gray-400 font-medium mt-8">Birthdate</Text>
              {/* <TextInput
          // placeholder="Select date"
          value={date.toDateString()}
          editable={false}
          onPressIn={() => setShow(true)}
          className="bg-blue-100 p-4 rounded-lg"
        /> */}

              <View className="items-center mt-2">
                {/* <DateTimePicker
              value={date}
              mode="date"
              display="default" // spinner mode allows textColor
              textColor="#000"
              onChange={onChange}
            /> */}
                <View
                  style={{
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <DatePickerInput
                    locale="en"
                    value={inputDate}
                    onChange={(d: any) => setInputDate(d)}
                    inputMode="start"
                    presentationStyle="pageSheet"
                    startYear={new Date().getFullYear() - 125}
                    endYear={new Date().getFullYear()}
                    withDateFormatInLabel
                    validRange={{
                      endDate: new Date(),
                      startDate: new Date(
                        new Date().setFullYear(new Date().getFullYear() - 100)
                      ),
                    }}
                    className="bg-blue-100 rounded-lg p-4"
                  />
                </View>
              </View>

              {/* <Text className="mt-2 text-gray-700">
            Selected: {date.toDateString()}
          </Text> */}
            </View>

            {/* <View className="px-4">
              <Text className="text-gray-400 font-medium mt-8 mb-2">
                Gender
              </Text>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setIsOpen(!isOpen)}
                className="flex-row items-center justify-between rounded-lg p-4  bg-blue-100"
              >
                <Text
                  className={`${
                    selectedGender ? "text-gray-800 " : "text-gray-400"
                  }`}
                >
                  {selectedGender || "Select gender"}
                </Text>
                <Feather
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
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
            </View> */}
            <View className="px-4">
              <Text className="text-gray-400 font-medium mt-8 mb-2">
                Phone Number (optional)
              </Text>
              <TextInput
                className="bg-blue-100 rounded-lg p-4"
                value={phoneNumber}
                keyboardType="numeric"
                onChangeText={setPhoneNumber}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View className="px-4 py-4 bg-white border-t border-gray-200">
          <TouchableOpacity
            className={`${
              isFormValid ? "bg-blue-600" : "bg-gray-300"
            } "bg-blue-300 rounded-lg p-4 w-full"`}
            disabled={!isFormValid}
            onPress={handleSubmit}
          >
            <Text className="text-white text-center text-lg font-medium">
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;
