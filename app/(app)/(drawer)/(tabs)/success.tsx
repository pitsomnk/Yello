import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter,} from 'expo-router';

const WithdrawalSuccess = () => {
  const router = useRouter();

  // Mock transaction details - replace with actual data passed from withdrawal page
  const transactionDetails = {
    amount: 'R 500.00',
    bank: 'Standard Bank',
    accountNumber: '****1234',
    reference: 'WD' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    date: new Date().toLocaleDateString(),
    estimatedArrival: new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString() // 2 days from now
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>✓</Text>
        </View>

        <Text style={styles.title}>Withdrawal Successful!</Text>
        <Text style={styles.subtitle}>Your money is on its way</Text>

        {/* Transaction Details Card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>{transactionDetails.amount}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.cardRow}>
            <Text style={styles.label}>Bank</Text>
            <Text style={styles.value}>{transactionDetails.bank}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.cardRow}>
            <Text style={styles.label}>Account</Text>
            <Text style={styles.value}>{transactionDetails.accountNumber}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.cardRow}>
            <Text style={styles.label}>Reference</Text>
            <Text style={styles.value}>{transactionDetails.reference}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.cardRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{transactionDetails.date}</Text>
          </View>
        </View>

        <View style={styles.estimateContainer}>
          <Text style={styles.estimateText}>
            Estimated arrival: {transactionDetails.estimatedArrival}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleBackToHome}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0BF00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 40,
    color: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#666666',
  },
  value: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  estimateContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 32,
  },
  estimateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#E0BF00',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WithdrawalSuccess;