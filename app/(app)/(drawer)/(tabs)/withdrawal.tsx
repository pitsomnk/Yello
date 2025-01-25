import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/context';
import { doc, getDoc, runTransaction, increment, collection, serverTimestamp } from "firebase/firestore";
import db from '../../../../lib/firebase-config';

const BANKS = [
  { id: '1', name: 'Standard Bank' },
  { id: '2', name: 'ABSA' },
  { id: '3', name: 'FNB' },
  { id: '4', name: 'Nedbank' },
  { id: '5', name: 'Capitec' },
];

const Withdrawal = () => {
  const router = useRouter();
  const { user } = useSession();
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  // Fetch user balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!user?.uid) return;
        
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setBalance(docSnap.data().balance || 0);
        }
      } catch (error) {
        console.error("Balance fetch error:", error);
        Alert.alert('Error', 'Failed to load balance');
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, [user?.uid]);

  // Handle withdrawal submission
  const handleWithdrawal = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    // Validation checks
    if (!selectedBank || !accountNumber || !accountHolder || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (withdrawalAmount > balance) {
      Alert.alert('Error', 'Insufficient funds');
      return;
    }

    setIsLoading(true);
    try {
      // Firestore transaction
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, "users", user.uid);
        const withdrawalsRef = collection(userRef, "withdrawals");

        // Update balance
        transaction.update(userRef, {
          balance: increment(-withdrawalAmount),
          updatedAt: serverTimestamp()
        });

        // Create withdrawal record
        const withdrawalDoc = doc(withdrawalsRef);
        transaction.set(withdrawalDoc, {
          bank: BANKS.find(b => b.id === selectedBank)?.name,
          accountNumber,
          accountHolder,
          amount: withdrawalAmount,
          status: 'pending',
          createdAt: serverTimestamp()
        });
      });

      // Navigate to success screen
      router.push('./success');
    } catch (error) {
      console.error('Withdrawal error:', error);
      Alert.alert('Error', 'Failed to process withdrawal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Withdraw Funds
      </Text>

      {/* Balance Display */}
      <View className="bg-gray-100 p-4 rounded-xl mb-6">
        <Text className="text-sm text-gray-600 mb-1">Available Balance</Text>
        {balanceLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text className="text-2xl font-bold text-gray-900">
            R {balance.toFixed(2)}
          </Text>
        )}
      </View>

      {/* Bank Selection */}
      <View className="mb-6">
        <Text className="text-sm text-gray-700 mb-2">Select Bank</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {BANKS.map(bank => (
            <TouchableOpacity
              key={bank.id}
              className={`p-3 rounded-lg mr-2 ${
                selectedBank === bank.id ? 'bg-yellow-500' : 'bg-gray-100'
              }`}
              onPress={() => setSelectedBank(bank.id)}
            >
              <Text className={`${
                selectedBank === bank.id 
                  ? 'text-black font-semibold' 
                  : 'text-gray-600'
              }`}>
                {bank.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Account Details Form */}
        <TextInput
          className="bg-gray-100 p-3 rounded-lg mb-4"
          placeholder="Account Number"
          keyboardType="numeric"
          value={accountNumber}
          onChangeText={setAccountNumber}
        />

        <TextInput
          className="bg-gray-100 p-3 rounded-lg mb-4"
          placeholder="Account Holder Name"
          value={accountHolder}
          onChangeText={setAccountHolder}
        />

        <TextInput
          className="bg-gray-100 p-3 rounded-lg mb-6"
          placeholder="Amount (ZAR)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Submit Button */}
        <TouchableOpacity
          className={`bg-yellow-500 p-4 rounded-lg items-center ${
            isLoading ? 'opacity-50' : ''
          }`}
          onPress={handleWithdrawal}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-black font-semibold text-base">
              Withdraw Funds
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer Note */}
      <Text className="text-xs text-gray-500 text-center">
        Note: Withdrawals may take 2-3 business days to process
      </Text>
    </ScrollView>
  );
};

export default Withdrawal;