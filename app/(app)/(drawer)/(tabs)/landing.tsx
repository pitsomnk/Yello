import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { db } from '../../../../lib/firebase-config';
import { collection, doc, runTransaction, increment } from "firebase/firestore";
import { useSession } from "@/context";

const PRICES = {
  Sorted: 15.5,
  Unsorted: 9.75,
  Mixed: 12.0
};

const InputForm = () => {
  const { user } = useSession();
  const [selectedValue, setSelectedValue] = useState('Sorted');
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user?.uid) {
      alert('User not authenticated');
      return;
    }

    const weight = parseFloat(inputText);
    if (isNaN(weight) || weight <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    setIsSubmitting(true);
    try {
      const pricePerKg = PRICES[selectedValue];
      const totalAmount = weight * pricePerKg;

      const userRef = doc(db, "users", user.uid);
      const wasteCollection = collection(userRef, "wasteSold");

      await runTransaction(db, async (transaction) => {
        const wasteDocRef = doc(wasteCollection);
        transaction.set(wasteDocRef, {
          type: selectedValue,
          weight,
          pricePerKg,
          totalAmount,
          date: new Date()
        });

        transaction.update(userRef, {
          balance: increment(totalAmount),
          updatedAt: new Date()
        });
      });

      alert('Transaction completed successfully!');
      router.back();
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Failed to complete transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 p-5 bg-white items-center justify-center">
      <Text className="text-2xl font-semibold mb-8 text-gray-800 text-center">
        Sell Aluminium
      </Text>

      <Text className="text-base font-medium mb-1 text-gray-700 w-full">
        Enter Weight (kg):
      </Text>
      <TextInput
        className="h-12 border border-gray-300 rounded-xl px-4 bg-white w-full"
        onChangeText={text => setInputText(text.replace(/[^0-9.]/g, ''))}
        value={inputText}
        placeholder="Enter weight in kilograms"
        keyboardType="decimal-pad"
        maxLength={10}
      />

      <Text className="text-base font-medium mb-1 text-gray-700 w-full mt-4">
        Select Type:
      </Text>
      <View className="border border-gray-300 rounded-xl bg-white w-full">
        <Picker
          selectedValue={selectedValue}
          onValueChange={setSelectedValue}
          className="h-12"
        >
          <Picker.Item label={`Sorted (R${PRICES.Sorted}/kg)`} value="Sorted" />
          <Picker.Item label={`Unsorted (R${PRICES.Unsorted}/kg)`} value="Unsorted" />
          <Picker.Item label={`Mixed (R${PRICES.Mixed}/kg)`} value="Mixed" />
        </Picker>
      </View>

      <Pressable 
        className={`bg-amber-400 p-4 rounded-xl items-center mt-5 w-full shadow-md ${
          isSubmitting ? 'opacity-60' : ''
        }`}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-black text-base font-semibold">
            Confirm Sale
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default InputForm;