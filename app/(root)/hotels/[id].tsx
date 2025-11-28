import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import travel from "@/assets/images/travel.jpg";
import Feather from "@expo/vector-icons/Feather";
import { getHotelsById, removeWishlist } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import HotelImageCard from "@/components/hotelImageCard";
import Swiper from "react-native-swiper";
import { useHotel } from "@/lib/HotelContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DatePickerModal } from "react-native-paper-dates";
import { Button } from "react-native-paper";
import { useCheckInAndOut } from "@/lib/CheckInAndOut";
import { useWishlist } from "@/lib/WishlistContext";
import { useGlobalContext } from "@/lib/global-provider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDate } from "@/lib/DateContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const services = [
  { id: "1", name: "Free Wi-Fi", icon: "wifi" },
  { id: "2", name: "Swimming Pool", icon: "droplet" },
  { id: "3", name: "Gym", icon: "activity" },
  { id: "4", name: "Parking", icon: "truck" },
  { id: "5", name: "Breakfast", icon: "coffee" },
  { id: "6", name: "Air Conditioning", icon: "wind" },
];

const Hotel = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [hotelData, setHotelData] = useState<any[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [selected, setSelected] = useState(false);
  const { setSelectedHotel } = useHotel();
  const { dateRange, getDateSummary } = useDate();
  // const [date, setDate] = useState(new Date());
  // const [showPicker, setShowPicker] = useState(false);
  const { checkInDate, setCheckInDate, checkOutDate, setCheckOutDate } =
    useCheckInAndOut();
  const { wishlist, toggleWishlistHandler, refreshWishlist } = useWishlist();
  // calculate isWishlisted when wishlist or hotelData changes
  // console.log("hotelData[0]?.$id:", hotelData[0]?.$id);
  // console.log(typeof wishlist[0]); // string
  // console.log(typeof hotelData[0].$id); // string?
  // console.log(`"${wishlist[0]}" === "${hotelData[0].$id}"`);
  const isWishlisted = React.useMemo(() => {
    if (!hotelData[0]?.$id || !wishlist) return false;
    return wishlist.includes(hotelData[0].$id);
  }, [wishlist, hotelData]);

  // const isWishlisted = wishlist?.some(h => h.$id === hotelData[0]?.$id);

  console.log("isWishlisted:", isWishlisted);
  console.log("wishlist:", wishlist);

  // const [open, setOpen] = React.useState(false);
  const [openCheckOut, setOpenCheckOut] = React.useState(false);
  const [openCheckIn, setOpenCheckIn] = React.useState(false);
  // const [isWishlisted, setIsWishlisted] = useState(false);
  const today = new Date();
  const isDisabled = checkInDate && checkOutDate && checkInDate < checkOutDate;
  const { user } = useGlobalContext();

  const onDismissCheckIn = React.useCallback(() => {
    setOpenCheckIn(false);
  }, [setOpenCheckIn]);
  const onDismissCheckOut = React.useCallback(() => {
    setOpenCheckOut(false);
  }, [setOpenCheckOut]);

  const onConfirmCheckIn = React.useCallback(
    (params: any) => {
      setOpenCheckIn(false);
      setCheckInDate(params.date);
    },
    [setOpenCheckIn, setCheckInDate]
  );

  const onConfirmCheckOut = React.useCallback(
    (params: any) => {
      setOpenCheckOut(false);
      setCheckOutDate(params.date);
    },
    [setOpenCheckOut, setCheckOutDate]
  );

  const { data: hotelDataResponse } = useAppwrite({
    fn: getHotelsById,
    params: {
      id: id!,
    },
  });

  //   console.log(hotelDataResponse);
  useEffect(() => {
    if (hotelDataResponse) {
      async function getHotelImages() {
        setHotelData(hotelDataResponse!);
      }
      getHotelImages();
    }
  }, [hotelDataResponse]);

  useEffect(() => {
    if (hotelData?.[0]?.images?.length) {
      const primary = hotelData[0].images.find((img: any) => img.is_primary);
      setPrimaryImage(primary?.image_url || hotelData[0].images[0].image_url);
    }
  }, [hotelData]);

  // Sort images so primary comes first
  const sortedImages = [...(hotelData[0]?.images || [])].sort(
    (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)
  );

  const handleImagePress = (image_url: string) => {
    // console.log("image_url:", image_url);
    setPrimaryImage(image_url);
  };

  const handleSelectRooms = (id: any) => {
    console.log("id:", id);
    setSelectedHotel(hotelData[0]);
    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);
    router.push(`/hotels/rooms/${id}`);
  };

  const sortedRooms = (hotelData[0]?.roomImageAndType || []).sort(
    (a: any, b: any) => {
      const priceA =
        typeof a.price_per_night === "string"
          ? parseFloat(a.price_per_night.replace(/\$/g, ""))
          : a.price_per_night;
      //   console.log("priceA:", priceA);

      const priceB =
        typeof b.price_per_night === "string"
          ? parseFloat(b.price_per_night.replace(/\$/g, ""))
          : b.price_per_night;
      //   console.log("priceB:", priceB);
      return priceA - priceB; // ascending: lowest price first
    }
  );

  const fallbackImage = hotelData[0]?.images[0]?.image_url;

  const handleToggleWishlist = () => {
    console.log("hotelData[0]?.$id:", hotelData[0]?.$id);
    toggleWishlistHandler(hotelData[0]?.$id);
  };

  return (
    <View className="flex-1">
      <FlatList
        data={hotelData[0]?.roomImageAndType}
        keyExtractor={(item) => item.$id.toString()}
        // numColumns={2}
        renderItem={({ item }) => (
          // <View className="mx-6 mb-2">
          //   <View className="flex-row items-center">
          //     {/* <Feather name={item.icon} size={22} color="#6B7280" /> */}

          //     <Text className=" text-black/80">{item.type}</Text>
          //   </View>
          // </View>
          <></>
        )}
        contentContainerClassName="pb-48 bg-white/90"
        showsVerticalScrollIndicator={false}
        // columnWrapperClassName="gap-28 mx-4"
        ListHeaderComponent={
          <View className="bg-white/90">
            <View className="">
              <View className="absolute top-0 left-0 right-0 flex flex-row items-center justify-between px-6 mt-16 z-10">
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="h-12 w-12 bg-white/80 rounded-full flex items-center justify-center"
                >
                  <Feather
                    name="arrow-left"
                    size={24}
                    color="rgb(16 16 16 / 0.8)"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push(`/search/chooseDates`)}
                  className=" py-2 px-4 bg-black/20 rounded-xl flex items-center justify-center"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center justify-center gap-2">
                    <Text className="text-white text-sm font-medium">
                      {getDateSummary()}
                    </Text>
                    <Feather name="edit" size={16} color="#fff" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleToggleWishlist}
                  className="h-12 w-12 bg-white/80 rounded-full flex items-center justify-center"
                >
                  {isWishlisted ? (
                    <Ionicons name="heart" size={24} color="#EF4444" />
                  ) : (
                    <Ionicons name="heart-outline" size={24} color="#EF4444" />
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: SCREEN_HEIGHT * 0.4,
                  width: Dimensions.get("window").width,
                }}
              >
                <Swiper
                  showsPagination
                  loop={false}
                  dotStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                  activeDotStyle={{ backgroundColor: "#fff" }}
                  width={Dimensions.get("window").width}
                  height={SCREEN_HEIGHT * 0.4}
                  removeClippedSubviews={false}
                  scrollEnabled={true}
                >
                  {sortedImages.map((image, index) => (
                    <View key={index} className="flex-1">
                      <Image
                        key={index}
                        source={{ uri: image.image_url }}
                        style={{
                          height: SCREEN_HEIGHT * 0.4,
                          width: Dimensions.get("window").width,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </Swiper>
              </View>
              <View className="px-6 py-4">
                <View>
                  <Text className="text-black/80 text-xl font-bold">
                    {hotelData[0]?.hotelName}
                  </Text>
                  <View className="flex-row items-baseline justify-start gap-1">
                    {/* <Text className="text-black/70 text-base ">
                      {hotelData[0]?.address}
                    </Text> */}
                    <Text className="text-black/90 text-lg ">
                      {[hotelData[0]?.city, hotelData[0]?.country].join(", ")}
                    </Text>
                  </View>
                </View>
              </View>
              {/* <View className="border-b border-gray-300"></View>
              <TouchableOpacity
                className="flex-row items-center justify-start px-2 mt-4"
                onPress={() => setOpenCheckIn(true)}
              >
                <Button
                  onPress={() => setOpenCheckIn(true)}
                  uppercase={false}
                  mode="text"
                >
                  <View className="flex-row items-center justify-start w-full gap-2">
                    <Feather name="calendar" size={24} color="#4C4DDC" />
                    <Text className="text-black/80 text-lg font-medium">
                      Check in:{" "}
                      <Text
                        className={`${
                          checkInDate
                            ? "text-black/80 text-xl font-normal underline"
                            : "text-black/50 text-base font-normal"
                        } `}
                      >
                        {checkInDate
                          ? (checkInDate as Date).toLocaleDateString()
                          : "choose a date"}
                      </Text>
                    </Text>
                  </View>
                </Button>
                <DatePickerModal
                  locale="en"
                  mode="single"
                  visible={openCheckIn}
                  onDismiss={onDismissCheckIn}
                  date={checkInDate ? new Date(checkInDate) : undefined}
                  validRange={{
                    startDate: new Date(),
                  }}
                  onConfirm={onConfirmCheckIn}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center justify-start px-2 mb-4"
                onPress={() => setOpenCheckOut(true)}
              >
                <Button
                  onPress={() => setOpenCheckOut(true)}
                  uppercase={false}
                  mode="text"
                >
                  <View className="flex-row items-center justify-start w-full gap-2">
                    <Feather name="calendar" size={24} color="#4C4DDC" />
                    <Text className="text-black/80 text-lg font-medium">
                      Check out:{" "}
                      <Text
                        className={`${
                          checkOutDate
                            ? "text-black/80 text-xl font-normal underline"
                            : "text-black/50 text-base font-normal"
                        } ${
                          checkOutDate &&
                          checkInDate &&
                          checkOutDate < checkInDate
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {checkOutDate
                          ? (checkOutDate as Date).toLocaleDateString()
                          : "choose a date"}
                      </Text>
                    </Text>
                  </View>
                </Button>
                <DatePickerModal
                  locale="en"
                  mode="single"
                  visible={openCheckOut}
                  onDismiss={onDismissCheckOut}
                  date={checkOutDate ? new Date(checkOutDate) : undefined}
                  validRange={{
                    startDate: new Date(),
                  }}
                  onConfirm={onConfirmCheckOut}
                />
              </TouchableOpacity> */}
              <View className="border-b border-gray-300"></View>
              <TouchableOpacity
                onPress={() => handleSelectRooms(hotelData[0]?.$id)}
                disabled={!dateRange.startDate && !dateRange.endDate}
                className="px-6 py-4 flex-row items-center justify-between"
              >
                <View>
                  <Text className="text-black/80 text-xl font-medium">
                    from ${sortedRooms[0]?.price_per_night} per night
                  </Text>
                  <View className="flex-row items-baseline justify-start gap-1">
                    <Text className="text-black/80 text-sm ">
                      taxes and fees extra
                    </Text>
                  </View>
                </View>
                <View
                  className={`${
                    !dateRange.startDate && !dateRange.endDate
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <Feather name="chevron-right" size={24} color="#4C4DDC" />
                </View>
              </TouchableOpacity>
              <View className="border-b border-gray-300"></View>

              <View className=" py-4 flex-row items-center justify-between">
                <View>
                  <FlatList
                    data={services}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="px-6 py-3 gap-4"
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity className="items-center justify-center flex-row gap-2">
                        <View className="bg-white rounded-full p-3 shadow-sm">
                          <Feather
                            name={item.icon as any}
                            size={24}
                            color="#4C4DDC"
                          />
                        </View>
                        <Text className="text-gray-700 text-sm mt-2 text-center">
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
              <View className="border-b border-gray-300"></View>
            </View>
            <View className="flex-1">
              <View className="mt-8 px-6">
                <Text className="text-xl text-black/80 font-medium">
                  About Us
                </Text>
                <Text className="mt-2 text-base text-black/50">
                  {hotelData[0]?.description}
                </Text>
                {/* <Text className="text-xl text-black/80 mt-12 font-bold">
                  Rooms & Suites
                </Text> */}
                <View className="mt-4"></View>
              </View>
            </View>
          </View>
        }
      ></FlatList>
      <View className="absolute bottom-0 bg-white h-[11%] shadow-lg left-0 right-0">
        {/* <View className="items-center justify-center"> */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            onPress={() => handleSelectRooms(hotelData[0]?.$id)}
            className={`bg-blue-300 w-full rounded-2xl ${
              !dateRange.startDate && !dateRange.endDate ? "opacity-50" : ""
            }`}
            disabled={!dateRange.startDate && !dateRange.endDate}
          >
            <Text className="text-white text-center py-6">Select Rooms</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </View>
    </View>
  );
};

export default Hotel;
