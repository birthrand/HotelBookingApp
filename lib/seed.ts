/**
 * seedHotelApp.js
 * Seed your Appwrite hotel booking database with multiple hotels and images
 * Ready for React Native.
 */

// import dotenv from "dotenv";
// dotenv.config({ path: "../.env.local" });

import { Client, Databases, Permission, Role } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.EXPO_PUBLIC_APPWRITE_API_KEY!);

const databases = new Databases(client);

export async function seed() {
  try {
    console.log("🌱 Seeding larger hotel dataset...");

    const dbId = "hotel_booking_db"; // replace with your DB ID
    const usersCollectionId = "users";
    const hotelsCollectionId = "hotels";
    const hotelImagesCollectionId = "hotel_images";
    const roomsCollectionId = "rooms";
    const roomImagesCollectionId = "room_images";

    // --- Users (keep a few sample users) ---
    const users = [
      {
        full_name: "Alice Johnson",
        email: "alice@example.com",
        phone: "1234567890",
        password_hash: "hashedpassword",
        role: "user",
      },
      {
        full_name: "Bob Smith",
        email: "bob@example.com",
        phone: "0987654321",
        password_hash: "hashedpassword",
        role: "user",
      },
    ];

    const createdUsers = [];
    for (const u of users) {
      const doc = await databases.createDocument(
        dbId,
        usersCollectionId,
        "unique()",
        u,
        [Permission.read(Role.any())]
      );
      createdUsers.push(doc);
      console.log("User created:", doc.$id);
    }

    // --- 1️⃣ Hotels ---
    const hotelNames = [
      "Oceanview Resort",
      "Mountain Lodge",
      "City Central Hotel",
      "Forest Retreat",
      "Desert Oasis",
      "Seaside Escape",
      "Lakeside Inn",
      "Urban Boutique",
      "Countryside Inn",
      "Skyline Hotel",
      "Riverside Lodge",
      "Grand Palace Hotel",
      "Cozy Cabin",
      "Luxury Suites",
      "Heritage Hotel",
      "Sunset Villa",
      "Beachfront Bungalows",
      "Hilltop Inn",
      "Metro Hotel",
      "Island Retreat",
    ];

    const cities = [
      "Miami",
      "Denver",
      "New York",
      "Portland",
      "Phoenix",
      "Los Angeles",
      "Seattle",
      "Chicago",
      "Austin",
      "San Francisco",
      "Boston",
      "Orlando",
      "San Diego",
      "Las Vegas",
      "Honolulu",
      "Atlanta",
      "Houston",
      "Dallas",
      "Washington D.C.",
      "Philadelphia",
    ];

    const countries = Array(20).fill("USA");

    const createdHotels = [];

    for (let i = 0; i < hotelNames.length; i++) {
      const hotelData = {
        hotelName: hotelNames[i],
        description: `Welcome to ${hotelNames[i]}, a beautiful place to stay.`,
        address: `${100 + i} Main St`,
        city: cities[i],
        state: "State",
        country: countries[i],
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
      };

      console.log(`Creating hotel ${i + 1}: ${hotelData.hotelName}`);
      console.log(`Using DB ID: ${dbId}, Collection ID: ${hotelsCollectionId}`);

      const hotelDoc = await databases.createDocument(
        dbId,
        hotelsCollectionId,
        "unique()",
        hotelData,
        [Permission.read(Role.any())]
      );
      createdHotels.push(hotelDoc);
    }

    // --- 2️⃣ Hotel Images ---
    const hotelImagesUrls = [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWx8ZW58MHwwfDB8fHwy&auto=format&fit=crop&q=60&w=600",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGhvdGVsfGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&q=60&w=600",
      "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGhvdGVsfGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&q=60&w=600",
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGhvdGVsfGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&q=60&w=600",
      "https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGhvdGVsfGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&q=60&w=600",
      "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGhvdGVsfGVufDB8MHwwfHx8Mg%3D%3D&auto=format&fit=crop&q=60&w=600",
    ];

    function shuffleArray<T>(array: T[]): T[] {
      return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    }

    for (const hotel of createdHotels) {
      // Shuffle images for this hotel
      const shuffledImages = shuffleArray(hotelImagesUrls);

      // Add 3 images per hotel
      for (let j = 0; j < 3; j++) {
        await databases.createDocument(
          dbId,
          hotelImagesCollectionId,
          "unique()",
          {
            hotel_id: hotel.$id,
            image_url: shuffledImages[j % shuffledImages.length],
            is_primary: j === 0, // first image is primary
            description: `Image ${j + 1} for ${hotel.hotelName}`,
          },
          [Permission.read(Role.any())]
        );
      }
    }

    // --- 3️⃣ Rooms and Room Images ---
    const roomTypes = [
      { type: "Standard Room", price: 120, max: 2 },
      { type: "Deluxe Room", price: 180, max: 3 },
      { type: "Suite", price: 250, max: 4 },
    ];

    const roomImagesUrls = [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsJTIwcm9vbXxlbnwwfDB8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
      "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGhvdGVsJTIwcm9vbXxlbnwwfDB8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
      "https://images.unsplash.com/photo-1631049307485-2bfb23080676?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGhvdGVsJTIwcm9vbXxlbnwwfDB8MHx8fDI%3D&auto=format&fit=crop&q=60&w=600",
    ];

    for (let i = 0; i < createdHotels.length; i++) {
      const hotel = createdHotels[i];

      for (let j = 0; j < roomTypes.length; j++) {
        const roomData = {
          hotel_id: hotel.$id,
          room_number: `${100 + j + i * 10}`,
          type: roomTypes[j].type,
          price_per_night: roomTypes[j].price,
          max_guests: roomTypes[j].max,
          description: `${roomTypes[j].type} with modern amenities`,
          status: "Available",
        };

        const roomDoc = await databases.createDocument(
          dbId,
          roomsCollectionId,
          "unique()",
          roomData,
          [Permission.read(Role.any())]
        );

        // Room image
        await databases.createDocument(
          dbId,
          roomImagesCollectionId,
          "unique()",
          {
            room_id: roomDoc.$id,
            image_url: roomImagesUrls[j],
            is_primary: true,
            description: `${roomTypes[j].type} image`,
          },
          [Permission.read(Role.any())]
        );
      }
    }

    console.log("🎉 Seeded 20+ hotels with images and rooms successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
}

export default seed;

export async function clearDatabase() {
  try {
    const dbId = "hotel_booking_db"; // replace with your database $id

    // Replace these with your actual collection IDs
    const collections = [
      "users",
      "hotels",
      "hotel_images",
      "rooms",
      "room_images",
      "bookings",
      "payments",
      "reviews",
    ];

    for (const collectionId of collections) {
      //   console.log(`🗑️ Clearing collection: ${collectionId}`);

      //   // Get all documents in the collection
      //   let documents = await databases.listDocuments(dbId, collectionId);

      //   for (const doc of documents.documents) {
      //     await databases.deleteDocument(dbId, collectionId, doc.$id);
      //     console.log(`Deleted document: ${doc.$id}`);
      //   }
      console.log(`🗑️ Clearing collection: ${collectionId}`);

      let documents;
      do {
        documents = await databases.listDocuments(dbId, collectionId); // max 100 per page

        for (const doc of documents.documents) {
          await databases.deleteDocument(dbId, collectionId, doc.$id);
          console.log(`Deleted document: ${doc.$id}`);
        }
      } while (documents.documents.length > 0);
    }

    console.log("🎉 All collections cleared successfully!");
  } catch (err) {
    console.error("❌ Failed to clear database:", err);
  }
}

// Run if executed directly
if (require.main === module) {
  clearDatabase();
}
