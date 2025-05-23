import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useSession } from "@/context";
import { router } from "expo-router";
import db from '../../../../lib/firebase-config';
import { collection, doc, getDoc, setDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";

// ============================================================================
// Interface Definitions
// ============================================================================
interface Transaction {
  id: string;
  type: string;
  weight: number;
  totalAmount: number;
  date: string;
}

// ============================================================================
// Main Component
// ============================================================================
const TabsIndexScreen = () => {
  // ============================================================================
  // Hooks & State Management
  // ============================================================================
  const { signOut, user } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTransactionsLoading, setTransactionsLoading] = useState(true);

  // ============================================================================
  // Data Fetching
  // ============================================================================
  const createUserDocument = async (user: any) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        balance: 0.0,
        email: user.email,
        displayName: user.displayName || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        currency: "ZAR"
      });
      console.log("User document created successfully");
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  };

  useEffect(() => {
    const fetchBalanceAndTransactions = async () => {
      try {
        if (!user?.uid) return;
        
        // Fetch user balance
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserBalance(userSnap.data().balance);
        } else {
          await createUserDocument(user);
          setUserBalance(0);
        }

        // Fetch recent transactions
        const wasteRef = collection(db, "users", user.uid, "wasteSold");
        const q = query(wasteRef, orderBy("date", "desc"), limit(3));
        const querySnapshot = await getDocs(q);

        const transactionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          type: doc.data().type,
          weight: doc.data().weight,
          totalAmount: doc.data().totalAmount,
          date: doc.data().date?.toDate().toLocaleDateString('en-GB') || 'Unknown date'
        }));

        setTransactions(transactionsData);
      } catch (error) {
        console.error("Data fetch error:", error);
        setError("Failed to load data");
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchBalanceAndTransactions();
  }, [user?.uid]);

  // ============================================================================
  // Memoized Values
  // ============================================================================
  const displayName = useMemo(() => (
    user?.displayName || user?.email?.split('@')[0] || 'Guest'
  ), [user]);

  // ============================================================================
  // Handlers
  // ============================================================================
  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      router.push('./withdrawal');
    } catch (err) {
      console.error('Withdrawal error:', err);
      setError('Withdrawal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellWaste = () => router.push('/explore');

  // ============================================================================
  // Render Helpers
  // ============================================================================
  const renderTransactions = () => {
    if (isTransactionsLoading) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }

    if (transactions.length === 0) {
      return (
        <Text className="text-gray-500 text-sm text-center py-3">
          No recent transactions found
        </Text>
      );
    }

    return transactions.map((transaction) => (
      <View 
        key={transaction.id} 
        className="flex-row justify-between items-center py-3 border-b border-gray-500 last:border-b-0"
      >
        <View className="flex-1">
          <Text className="font-medium text-gray-800 capitalize">
            {transaction.type}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            {transaction.date}
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-semibold text-gray-900">
            R {transaction.totalAmount.toFixed(2)}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            {transaction.weight} kg
          </Text>
        </View>
      </View>
    ));
  };

  // ============================================================================
  // Render
  // ============================================================================
  if (error) {
    return (
      <View className="flex-1 bg-white p-4 justify-center items-center">
        <Text className="text-red-500 mb-4">{error}</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => setError(null)}
        >
          <Text className="text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header Section */}
      <View className="items-center mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-1">
          Welcome back,
        </Text>
        <Text className="text-2xl font-bold text-blue-600">
          {displayName}
        </Text>
      </View>

      {/* Balance Card */}
      <View className="bg-gray-100 rounded-xl p-5 shadow-md mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-sm text-gray-600">Current Balance</Text>
          <Text className="text-xs text-gray-500">ZAR</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          R {userBalance.toFixed(2)}
        </Text>
        
        <TouchableOpacity
          className={`rounded-lg p-3 ${isLoading ? "bg-gray-400" : "bg-yellow-500"}`}
          onPress={handleWithdraw}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text className="text-black text-center font-semibold">
              Withdraw Funds
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Recent Transactions Card */}
      <View className="bg-gray-100 rounded-xl p-4 mb-4 shadow-md">
        <Text className="text-md font-semibold text-gray-800 mb-3">
          Recent Transactions
        </Text>
        {renderTransactions()}
      </View>

      {/* Educational Tip */}
      <View className="bg-gray-100 rounded-xl p-3 mb-4">
        <Text className="text-xs text-center text-gray-600">
          💡 Tip: Recycling more materials increases your earnings!
        </Text>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        className="bg-black rounded-lg p-3 mb-4 shadow-md"
        onPress={handleSellWaste}
      >
        <Text className="text-white text-center font-semibold">
          Sell Recyclable Waste
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-neutral-500 px-6 py-3 rounded-lg active:bg-red-600"
      >
        <Text className="text-white font-semibold text-base">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabsIndexScreen;