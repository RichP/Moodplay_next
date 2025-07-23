// Example React Native Game Screen using the MoodPlay API
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { MoodPlayAPI } from './MoodPlayMobileAPI';

// Initialize the API client
const api = new MoodPlayAPI();

const GameItem = ({ game, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.gameCard} 
      onPress={() => onPress(game)}
    >
      <Image 
        source={{ uri: game.image }} 
        style={styles.gameImage} 
        resizeMode="cover"
      />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{game.name}</Text>
        <Text style={styles.gameMood}>{game.mood}</Text>
        <Text 
          style={styles.gameDescription} 
          numberOfLines={2}
        >
          {game.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const MoodFilterItem = ({ mood, isSelected, onSelect }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.moodFilter,
        isSelected ? styles.moodFilterSelected : null
      ]}
      onPress={() => onSelect(mood)}
    >
      <Text 
        style={[
          styles.moodFilterText,
          isSelected ? styles.moodFilterTextSelected : null
        ]}
      >
        {mood}
      </Text>
    </TouchableOpacity>
  );
};

export const GameScreen = () => {
  const [games, setGames] = useState([]);
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize API when component mounts
  useEffect(() => {
    const initializeAPI = async () => {
      await api.init();
      fetchMoods();
      fetchGames();
    };
    
    initializeAPI();
  }, []);
  
  // Fetch games when selected mood changes
  useEffect(() => {
    fetchGames();
  }, [selectedMood]);
  
  const fetchGames = async () => {
    try {
      setLoading(true);
      const filters = {};
      
      if (selectedMood) {
        filters.selectedMood = selectedMood;
      }
      
      const gamesData = await api.getGames(filters);
      setGames(gamesData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch games:', err);
      setError('Failed to load games. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMoods = async () => {
    try {
      const moodsData = await api.getMoods();
      // Extract mood names from the data
      const moodNames = moodsData.map(m => m.mood);
      setMoods(moodNames);
    } catch (err) {
      console.error('Failed to fetch moods:', err);
    }
  };
  
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood === selectedMood ? null : mood);
  };
  
  const handleGamePress = (game) => {
    // Handle game selection - navigate to details, etc.
    console.log('Selected game:', game);
  };
  
  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchGames}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>MoodPlay Games</Text>
      
      {/* Mood filters */}
      <FlatList
        horizontal
        data={moods}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <MoodFilterItem
            mood={item}
            isSelected={selectedMood === item}
            onSelect={handleMoodSelect}
          />
        )}
        style={styles.moodFiltersContainer}
        showsHorizontalScrollIndicator={false}
      />
      
      {/* Games list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <GameItem game={item} onPress={handleGamePress} />
          )}
          style={styles.gamesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gamesListContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  moodFiltersContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  moodFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
  },
  moodFilterSelected: {
    backgroundColor: '#0070f3',
  },
  moodFilterText: {
    fontWeight: '500',
  },
  moodFilterTextSelected: {
    color: 'white',
  },
  gamesList: {
    flex: 1,
  },
  gamesListContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gameImage: {
    width: 100,
    height: 140,
  },
  gameInfo: {
    flex: 1,
    padding: 12,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gameMood: {
    fontSize: 14,
    color: '#0070f3',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0070f3',
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});
