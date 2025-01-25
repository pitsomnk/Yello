import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';

const materials = [
  { id: '1', name: 'Aluminium', icon: 'recycle' },
  
];

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setIsLoading(true);

    setTimeout(() => setIsLoading(false), 500);
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMaterialPress = (material: { id: string; name: string; icon: string }) => {
    router.push(`/landing?material=${material.name}`);
  };

  return (
    <ScrollView style={styles.container}>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.title}>Explore Recyclable Materials</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search materials..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Loading or Materials Section */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#E0BF00" />
      ) : filteredMaterials.length > 0 ? (
        <View style={styles.materialsContainer}>
          {filteredMaterials.map((material) => (
            <TouchableOpacity
              key={material.id}
              style={styles.materialCard}
              onPress={() => handleMaterialPress(material)}
            >
              <Icon name={material.icon} size={80} color="#333" style={styles.materialIcon} />
              <Text style={styles.materialName}>{material.name}</Text>
              <IconSymbol size={32} name="plus" color="black" />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noResultsText}>No materials match your search.</Text>
      )}

      {/* Tips Section */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Recycling Tips</Text>
        <Text style={styles.tipsText}>Separate materials based on their types.</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding:50
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  searchSection: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  materialsContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  materialCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  materialIcon: {
    marginBottom: 10,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  tipsContainer: {
    padding: 20,
    backgroundColor: '#E0BF00',
    borderRadius: 10,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  ctaContainer: {
    padding: 20,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: '#E0BF00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
});

export default ExploreScreen;
