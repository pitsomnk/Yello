import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface DataPoint {
  value: number;
  dataset: number;
  x: number;
  y: number;
  index: number;
}

const Analytics = () => {
  const [selectedPoint, setSelectedPoint] = useState<{
    month: string;
    value: string;
  } | null>(null);

  // Sample static data
  const transactionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [
      {
        data: [
          150.20,  // January
          280.50,  // February
          210.75,  // March
          350.00,  // April
          420.25,  // May
          380.60,  //june
          650.20,  // July
          145.20, //Aug
          780.50,  //Sep
          890.31,  //Oct
          120.16, //Nov
          160.00  //Dec
        ], 
      },
    ],
  };

  const handleDataPointClick = (data: { value: number, index: number }) => {
    if (typeof data.value === 'number' && typeof data.index === 'number') {
      setSelectedPoint({
        month: transactionData.labels[data.index],
        value: data.value.toFixed(2)
      });

      // Auto-hide the tooltip after 3 seconds
      setTimeout(() => {
        setSelectedPoint(null);
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      
      <View style={styles.chartContainer}>
        {selectedPoint && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>
              {selectedPoint.month}: R {selectedPoint.value}
            </Text>
          </View>
        )}
        <LineChart
          data={transactionData}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel="R "
          onDataPointClick={handleDataPointClick}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(224, 191, 0, ${opacity})`, // Your yellow brand color
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#E0BF00',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Earnings</Text>
          <Text style={styles.statValue}>R 1,792.30</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Weight</Text>
          <Text style={styles.statValue}>179.2 kg</Text>
        </View>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Materials Breakdown</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#E0BF00' }]} />
          <Text style={styles.legendText}>Aluminum - 40%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#666666' }]} />
          <Text style={styles.legendText}>Glass - 25%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#999999' }]} />
          <Text style={styles.legendText}>Plastic - 20%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#CCCCCC' }]} />
          <Text style={styles.legendText}>Steel - 15%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  legendContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    width: '100%',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#666666',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
    top: 10,
  },
  tooltipText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Analytics;