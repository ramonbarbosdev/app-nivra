import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PalavraDesafio({ pergunta }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.pergunta}>{pergunta}</Text>
      <Text style={styles.helper}>Digite uma palavra</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  pergunta: { color: '#fff', fontSize: 18 },
  helper: { color: '#aaa', marginTop: 8 },
});