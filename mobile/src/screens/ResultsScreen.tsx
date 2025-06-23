import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ResultsScreenProps {
  navigation: any;
}

export default function ResultsScreen({ navigation }: ResultsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ResultsScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
