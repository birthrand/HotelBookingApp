# Hotel Booking App

A modern, full-featured hotel booking mobile application built with React Native and Expo. Browse hotels, book rooms, manage reservations, and track your travel history—all in one beautiful, intuitive interface.

## 🚀 Features

### Core Functionality

- **Hotel Discovery**: Browse featured hotels and search by location, name, or destination
- **Room Selection**: View detailed room information with images, amenities, and pricing
- **Booking Management**:
  - Create and confirm bookings
  - View upcoming trips
  - Access booking history
  - Track booking status (Active, Pending, Completed)
- **User Authentication**: Google OAuth integration for seamless sign-in
- **Payment Processing**: Multiple payment methods (Visa, Mastercard, PayPal)
- **Wishlist**: Save favorite hotels for later
- **Guest Management**: Add and manage guest information
- **Date Selection**: Flexible check-in and check-out date picker
- **Search & Filters**: Advanced search with date range and guest count filters

### User Experience

- **Modern UI/UX**: Clean, accessible design with smooth animations
- **Loading States**: Elegant loading screens throughout the app
- **Responsive Design**: Optimized for all screen sizes
- **Status Indicators**: Visual badges for booking statuses
- **Empty States**: Helpful messages when no data is available

## 🛠️ Tech Stack

- **Framework**: React Native 0.81.5
- **Runtime**: Expo ~54.0.23
- **Navigation**: Expo Router 6.0.14 (file-based routing)
- **Styling**: NativeWind 4.2.1 (Tailwind CSS for React Native)
- **Backend**: Appwrite (Database, Authentication, Storage)
- **State Management**: React Context API
- **Icons**: Expo Vector Icons (Feather)
- **Date Picker**: React Native Paper Dates
- **Image Handling**: Expo Image
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Appwrite account and project setup
- iOS Simulator (for Mac) or Android Emulator

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd HotelBookingApp/HotelBookingApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   EXPO_PUBLIC_APPWRITE_HOTELS_COLLECTION_ID=your_hotels_collection_id
   EXPO_PUBLIC_APPWRITE_ROOMS_COLLECTION_ID=your_rooms_collection_id
   EXPO_PUBLIC_APPWRITE_HOTEL_IMAGES_COLLECTION_ID=your_hotel_images_collection_id
   EXPO_PUBLIC_APPWRITE_ROOM_IMAGES_COLLECTION_ID=your_room_images_collection_id
   EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
   EXPO_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID=your_bookings_collection_id
   EXPO_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID=your_payments_collection_id
   EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=your_reviews_collection_id
   EXPO_PUBLIC_APPWRITE_WISHLIST_COLLECTION_ID=your_wishlist_collection_id
   EXPO_PUBLIC_APPWRITE_API_KEY=your_server_api_key
   ```

4. **Set up Appwrite Database**

   The app requires the following collections in your Appwrite database:

   - `hotels` - Hotel information
   - `rooms` - Room details linked to hotels
   - `hotel_images` - Hotel image URLs
   - `room_images` - Room image URLs
   - `users` - User profiles
   - `bookings` - Booking records
   - `payments` - Payment transactions
   - `reviews` - Hotel reviews
   - `wishlist` - User wishlist items

   You can use the seed script (`lib/seed.ts`) to populate initial data.

5. **Start the development server**

   ```bash
   npm start
   # or
   npx expo start
   ```

6. **Run on your preferred platform**

   ```bash
   # iOS Simulator
   npm run ios

   # Android Emulator
   npm run android

   # Web Browser
   npm run web
   ```

## 📱 Project Structure

```
HotelBookingApp/
├── app/                          # Expo Router file-based routing
│   ├── (root)/                   # Root layout group
│   │   ├── (tabs)/               # Tab navigation screens
│   │   │   ├── index.tsx         # Home screen
│   │   │   ├── booking.tsx       # Booking tabs
│   │   │   ├── profile.tsx       # User profile
│   │   │   └── wishlist.tsx      # Wishlist
│   │   ├── booking/              # Booking flow
│   │   │   ├── confirm.tsx       # Booking confirmation
│   │   │   ├── upcoming.tsx      # Upcoming trips
│   │   │   ├── history.tsx       # Booking history
│   │   │   └── success.tsx        # Booking success
│   │   ├── hotels/               # Hotel screens
│   │   │   ├── [id].tsx          # Hotel details
│   │   │   ├── newIndex.tsx      # Hotels list
│   │   │   └── rooms/[id].tsx    # Room details
│   │   ├── search/               # Search flow
│   │   │   ├── find.tsx          # Search input
│   │   │   ├── chooseDates.tsx   # Date selection
│   │   │   ├── editGuests.tsx    # Guest selection
│   │   │   └── searchResults.tsx # Search results
│   │   ├── payment/              # Payment screens
│   │   │   └── paymentMethod.tsx # Payment selection
│   │   ├── guest/                # Guest management
│   │   │   ├── index.tsx         # Guest list
│   │   │   └── new.tsx           # Add guest
│   │   └── profile/              # Profile management
│   │       └── edit.tsx          # Edit profile
│   └── sign-in.tsx               # Authentication
├── components/                   # Reusable components
│   ├── featuredCards.tsx
│   ├── hotelCards.tsx
│   ├── hotelImageCard.tsx
│   ├── loadingScreen.tsx
│   └── roomCard.tsx
├── lib/                          # Core utilities and contexts
│   ├── appwrite.ts              # Appwrite API functions
│   ├── useAppwrite.ts           # Custom hook for API calls
│   ├── global-provider.tsx      # Global context provider
│   ├── BookingContext.tsx       # Booking state management
│   ├── HotelContext.tsx         # Hotel state management
│   ├── RoomContext.tsx          # Room state management
│   ├── GuestContext.tsx         # Guest state management
│   ├── DateContext.tsx          # Date selection context
│   ├── CheckInAndOut.tsx        # Check-in/out context
│   ├── WishlistContext.tsx      # Wishlist context
│   └── seed.ts                 # Database seeding script
├── assets/                       # Images, icons, fonts
└── constants/                   # Static data
```

## 🎨 Design System

### Colors

- **Primary**: Blue (`bg-blue-300`, `#93C5FD`)
- **Status Colors**:
  - Active: `bg-blue-500` (`#3B82F6`)
  - Completed: `bg-emerald-500` (`#10B981`)
  - Pending: `bg-yellow-500` (`#EAB308`)
  - Cancelled: `bg-red-500` (`#EF4444`)

### Typography

- Uses system fonts with Tailwind typography utilities
- Font weights: `font-medium`, `font-semibold`, `font-bold`

### Components

- Consistent rounded corners (`rounded-xl`, `rounded-2xl`)
- Shadow utilities for depth (`shadow-sm`)
- Safe area handling for all screens

## 🔐 Authentication

The app uses Google OAuth for authentication via Appwrite. Users are automatically created in the database upon first sign-in.

## 📊 State Management

The app uses React Context API for state management:

- **GlobalProvider**: User authentication state
- **HotelProvider**: Selected hotel context
- **RoomProvider**: Selected room context
- **BookingProvider**: Booking information
- **GuestProvider**: Guest details
- **DateProvider**: Date range selection
- **WishlistProvider**: Wishlist items

## 🧪 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- File-based routing with Expo Router
- Component-based architecture

## 🚢 Building for Production

1. **Build for iOS**

   ```bash
   eas build --platform ios
   ```

2. **Build for Android**

   ```bash
   eas build --platform android
   ```

3. **Submit to app stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## 📝 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using React Native and Expo
