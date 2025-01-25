import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

const ConfirmSale = () => {
  const { weight, type } = useLocalSearchParams();
  const weightValue = Array.isArray(weight) ? weight[0] : weight;
  const typeValue = Array.isArray(type) ? type[0] : type;
  const constantMultiplier = 10;
  const total = parseFloat(weightValue) * constantMultiplier;

  return (
    <View className="flex-1 items-center justify-center p-5 bg-gray-100">
      {/* Modal Card */}
      <View className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
        <Text className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Confirmation
        </Text>

        {/* Details Section */}
        <View className="space-y-4 mb-4">
          <View className="flex-row justify-between items-center pb-3 border-b border-neutral-200">
            <Text className="text-base font-medium text-neutral-600">Type:</Text>
            <Text className="text-base font-semibold text-neutral-800">{typeValue}</Text>
          </View>

          <View className="flex-row justify-between items-center pb-3 border-b border-neutral-200">
            <Text className="text-base font-medium text-neutral-600">Weight:</Text>
            <Text className="text-base font-semibold text-neutral-800">{weightValue} kg</Text>
          </View>
        </View>

        {/* Total Section */}
        <View className="flex-row justify-between items-center pt-4 border-t-2 border-amber-500">
          <Text className="text-lg font-semibold text-gray-800">Total:</Text>
          <Text className="text-xl font-bold text-amber-600">R {total.toFixed(2)}</Text>
        </View>

        {/* Done Button */}
        <TouchableOpacity 
          className="w-full bg-amber-400 rounded-lg p-4 mt-6"
          onPress={() => router.push('/')}
        >
          <Text className="text-center font-bold text-base text-black">Done</Text>
        </TouchableOpacity>
      </View>

      {/* Terms & Conditions */}
      <View className="mt-8 px-4">
        <Text className="text-sm font-semibold text-center text-gray-700 mb-2">
          Terms and Conditions
        </Text>
        <Text className="text-xs text-center text-neutral-500">
          By completing a purchase, you agree to be bound by these terms and conditions. 
          If you do not agree, please refrain from using our products/services.
        </Text>
      </View>
    </View>
  );
};

export default ConfirmSale;