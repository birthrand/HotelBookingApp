/**
 * setupHotelApp.js
 * Run this script ONCE to initialize all your Appwrite collections,
 * indexes, and permissions for the hotel booking app.
 */
import dotenv from "dotenv";
dotenv.config({ path: "../.env.local" }); // explicitly load .env.local

import { Client, Databases, Permission, Role } from "node-appwrite";

// --- DEBUG: check env variables ---
console.log("APPWRITE_ENDPOINT:", process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT);
console.log(
  "APPWRITE_PROJECT_ID:",
  process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID
);
console.log(
  "APPWRITE_API_KEY:",
  process.env.EXPO_PUBLIC_APPWRITE_API_KEY ? "Loaded" : "Missing"
);

// --- CONFIGURE APPWRITE CLIENT ---
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.EXPO_PUBLIC_APPWRITE_API_KEY); // Must be server API key

const databases = new Databases(client);

(async () => {
  try {
    console.log("🏗️ Creating hotel booking database...");

    // 1️⃣ CREATE DATABASE
    const db = await databases.create("hotel_booking_db", "HotelBookingDB");
    const dbId = db.$id;
    console.log("✅ Database created:", dbId);

    // --- PERMISSION HELPERS ---
    const authRead = [Permission.read(Role.users())];
    const authWrite = [
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];

    // 2️⃣ USERS COLLECTION
    const users = await databases.createCollection(
      dbId,
      "users",
      "Users",
      authRead.concat(authWrite)
    );
    await databases.createStringAttribute(
      dbId,
      users.$id,
      "full_name",
      100,
      true
    );
    await databases.createStringAttribute(dbId, users.$id, "email", 120, true);
    await databases.createStringAttribute(dbId, users.$id, "phone", 20, false);
    await databases.createStringAttribute(
      dbId,
      users.$id,
      "password_hash",
      255,
      true
    );
    await databases.createStringAttribute(dbId, users.$id, "role", 20, true);

    await databases.createIndex(
      dbId,
      users.$id,
      "email_index",
      "key",
      ["email"],
      ["asc"],
      [],
      true
    );
    console.log("✅ Users collection created");

    // 3️⃣ HOTELS COLLECTION
    const hotels = await databases.createCollection(
      dbId,
      "hotels",
      "Hotels",
      authRead.concat(authWrite)
    );
    await databases.createStringAttribute(dbId, hotels.$id, "name", 100, true);
    await databases.createStringAttribute(
      dbId,
      hotels.$id,
      "description",
      1000,
      false
    );
    await databases.createStringAttribute(
      dbId,
      hotels.$id,
      "address",
      255,
      true
    );
    await databases.createStringAttribute(dbId, hotels.$id, "city", 100, true);
    await databases.createStringAttribute(
      dbId,
      hotels.$id,
      "state",
      100,
      false
    );
    await databases.createStringAttribute(
      dbId,
      hotels.$id,
      "country",
      100,
      true
    );
    await databases.createFloatAttribute(dbId, hotels.$id, "rating", false);
    await databases.createIndex(
      dbId,
      hotels.$id,
      "city_index",
      "key",
      ["city"],
      ["asc"]
    );
    console.log("✅ Hotels collection created");

    // 4️⃣ HOTEL IMAGES COLLECTION
    const hotelImages = await databases.createCollection(
      dbId,
      "hotel_images",
      "HotelImages",
      authRead.concat(authWrite)
    );
    await databases.createStringAttribute(
      dbId,
      hotelImages.$id,
      "hotel_id",
      64,
      true
    );
    await databases.createStringAttribute(
      dbId,
      hotelImages.$id,
      "image_url",
      500,
      true
    );
    await databases.createBooleanAttribute(
      dbId,
      hotelImages.$id,
      "is_primary",
      false
    );
    await databases.createStringAttribute(
      dbId,
      hotelImages.$id,
      "description",
      255,
      false
    );
    await databases.createIndex(
      dbId,
      hotelImages.$id,
      "hotel_index",
      "key",
      ["hotel_id"],
      ["asc"]
    );
    console.log("✅ HotelImages collection created");

    // 5️⃣ ROOMS COLLECTION
    const rooms = await databases.createCollection(
      dbId,
      "rooms",
      "Rooms",
      authRead.concat(authWrite)
    );
    await databases.createStringAttribute(
      dbId,
      rooms.$id,
      "hotel_id",
      64,
      true
    );
    await databases.createStringAttribute(
      dbId,
      rooms.$id,
      "room_number",
      20,
      true
    );
    await databases.createStringAttribute(dbId, rooms.$id, "type", 50, true);
    await databases.createFloatAttribute(
      dbId,
      rooms.$id,
      "price_per_night",
      true
    );
    await databases.createIntegerAttribute(dbId, rooms.$id, "max_guests", true);
    await databases.createStringAttribute(
      dbId,
      rooms.$id,
      "description",
      500,
      false
    );
    await databases.createStringAttribute(dbId, rooms.$id, "status", 20, true);
    await databases.createIndex(
      dbId,
      rooms.$id,
      "hotel_index",
      "key",
      ["hotel_id"],
      ["asc"]
    );
    console.log("✅ Rooms collection created");

    // 6️⃣ ROOM IMAGES COLLECTION
    const roomImages = await databases.createCollection(
      dbId,
      "room_images",
      "RoomImages",
      authRead.concat(authWrite)
    );
    await databases.createStringAttribute(
      dbId,
      roomImages.$id,
      "room_id",
      64,
      true
    );
    await databases.createStringAttribute(
      dbId,
      roomImages.$id,
      "image_url",
      500,
      true
    );
    await databases.createBooleanAttribute(
      dbId,
      roomImages.$id,
      "is_primary",
      false
    );
    await databases.createStringAttribute(
      dbId,
      roomImages.$id,
      "description",
      255,
      false
    );
    await databases.createIndex(
      dbId,
      roomImages.$id,
      "room_index",
      "key",
      ["room_id"],
      ["asc"]
    );
    console.log("✅ RoomImages collection created");

    // 7️⃣ BOOKINGS COLLECTION
    const bookings = await databases.createCollection(
      dbId,
      "bookings",
      "Bookings",
      authRead.concat(authWrite)
    );
    await databases.createStringAttribute(
      dbId,
      bookings.$id,
      "user_id",
      64,
      true
    );
    await databases.createStringAttribute(
      dbId,
      bookings.$id,
      "room_id",
      64,
      true
    );
    await databases.createDatetimeAttribute(
      dbId,
      bookings.$id,
      "check_in_date",
      true
    );
    await databases.createDatetimeAttribute(
      dbId,
      bookings.$id,
      "check_out_date",
      true
    );
    await databases.createFloatAttribute(
      dbId,
      bookings.$id,
      "total_price",
      true
    );
    await databases.createStringAttribute(
      dbId,
      bookings.$id,
      "status",
      20,
      true
    );
    await databases.createIndex(
      dbId,
      bookings.$id,
      "user_index",
      "key",
      ["user_id"],
      ["asc"]
    );
    await databases.createIndex(
      dbId,
      bookings.$id,
      "room_index",
      "key",
      ["room_id"],
      ["asc"]
    );
    console.log("✅ Bookings collection created");

    // 8️⃣ PAYMENTS COLLECTION
    const payments = await databases.createCollection(
      dbId,
      "payments",
      "Payments",
      authRead.concat(authWrite)
    );
    await databases.createStringAttribute(
      dbId,
      payments.$id,
      "booking_id",
      64,
      true
    );
    await databases.createFloatAttribute(dbId, payments.$id, "amount", true);
    await databases.createStringAttribute(
      dbId,
      payments.$id,
      "method",
      50,
      true
    );
    await databases.createStringAttribute(
      dbId,
      payments.$id,
      "status",
      20,
      true
    );
    await databases.createStringAttribute(
      dbId,
      payments.$id,
      "transaction_id",
      100,
      false
    );
    await databases.createIndex(
      dbId,
      payments.$id,
      "booking_index",
      "key",
      ["booking_id"],
      ["asc"]
    );
    console.log("✅ Payments collection created");

    // 9️⃣ REVIEWS COLLECTION
    const reviews = await databases.createCollection(
      dbId,
      "reviews",
      "Reviews",
      authRead.concat(authWrite)
    );
    await databases.createStringAttribute(
      dbId,
      reviews.$id,
      "hotel_id",
      64,
      true
    );
    await databases.createStringAttribute(
      dbId,
      reviews.$id,
      "user_id",
      64,
      true
    );
    await databases.createIntegerAttribute(dbId, reviews.$id, "rating", true);
    await databases.createStringAttribute(
      dbId,
      reviews.$id,
      "comment",
      500,
      false
    );
    await databases.createIndex(
      dbId,
      reviews.$id,
      "hotel_index",
      "key",
      ["hotel_id"],
      ["asc"]
    );
    console.log("✅ Reviews collection created");

    console.log(
      "\n🎉 All collections, attributes, indexes, and permissions created successfully!"
    );
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
  }
})();
