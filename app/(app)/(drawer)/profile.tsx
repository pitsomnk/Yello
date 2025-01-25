import { useSession } from "@/context";
import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";

const ProfileScreen = () => {
  // ============================================================================
  // Hooks
  // ============================================================================
  const { user } = useSession();

  // ============================================================================
  // Computed Values
  // ============================================================================

  /**
   * Gets the display name for the welcome message
   * Prioritizes user's name, falls back to email, then default greeting
   */
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Guest";

  const profilePicture =
    user?.photoURL || "https://media.licdn.com/dms/image/v2/C4D03AQFKBwqyjDwy9g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1662027279593?e=1742428800&v=beta&t=98CDFGttYpiqjt8y1NfmW61MBkrr1q3AuHJYEA1-UBw";

  const email = user?.email || "Not provided";
  const lastSeen = user?.metadata?.lastSignInTime || "Unavailable";
  const accountCreated = user?.metadata?.creationTime || "Unavailable";

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Header Section */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: profilePicture }}
          className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-md"
        />
        <Text className="text-2xl font-extrabold text-blue-900 mt-4">
          {displayName}
        </Text>
        <Text className="text-base font-medium text-gray-600 mt-1">
          {email}
        </Text>
      </View>

      {/* User Details Section */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <Text className="text-lg font-semibold text-gray-700">
          Last Seen:
          <Text className="text-gray-900"> {lastSeen}</Text>
        </Text>
        <Text className="text-lg font-semibold text-gray-700 mt-3">
          Account Created:
          <Text className="text-gray-900"> {accountCreated}</Text>
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex flex-col space-y-6">
        <TouchableOpacity
          onPress={() => console.log("Navigate to Edit Profile")}
          className="bg-blue-600 py-4 rounded-lg items-center shadow-md"
        >
          <Text className="text-white font-bold text-lg">Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => console.log("Navigate to Settings")}
          className="bg-gray-300 py-4 rounded-lg items-center shadow-md"
        >
          <Text className="text-gray-700 font-bold text-lg">Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => console.log("Log Out")}
          className="bg-red-600 py-4 p-6 rounded-lg items-center shadow-md"
        >
          <Text className="text-white font-bold text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
