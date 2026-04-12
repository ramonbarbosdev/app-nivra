import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/src/theme/colors';
import { useJogoStore } from '@/src/store/jogoStore';
import DesafioRenderer from '@/src/components/desafio/DesafioRenderer';

export default function DesafioScreen() {

  const desafioAtual = useJogoStore((s) => s.desafioAtual);

  useEffect(() => {
    if (!desafioAtual) {
      router.replace('/menu');
    }
  }, [desafioAtual]);

  if (!desafioAtual) return null;

  return (
    <SafeAreaView style={styles.container}>
      <DesafioRenderer
        tipo={desafioAtual.tpDesafio}
        pergunta={desafioAtual.dsPergunta}
      />

      <Pressable onPress={() => router.back()}>
        <Text style={styles.voltar}>Voltar</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  pergunta: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  erro: {
    color: 'red',
    textAlign: 'center',
  },
  voltar: {
    color: '#aaa',
    marginTop: 20,
    textAlign: 'center',
  },
  finalizar: {
    color: Colors.button,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
});