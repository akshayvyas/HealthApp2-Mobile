import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CommitmentScreenProps {
  navigation: any;
}

export default function CommitmentScreen({ navigation }: CommitmentScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CommitmentScreen</Text>
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
