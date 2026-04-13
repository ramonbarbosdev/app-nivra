import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useJogoStore } from '@/src/store/jogoStore';
import { Colors } from '@/src/theme/colors';
import { ResultGrid } from '@/src/components/ResultGrid';
import { StatusJogo } from '@/src/types/StatusJogo';

const statusToEmoji: Record<StatusJogo, string> = {
  correto: Colors.accent,
  perto: Colors.yellow,
  errado: Colors.gray,
  fechado: Colors.gray,
  pendente: Colors.gray,
  alto: Colors.gray,
  baixo: Colors.gray,
};

function getMensagem(ganhou: boolean, tentativas: number) {
  if (!ganhou) return 'Quase lá. Você chega na próxima!';

  if (tentativas === 1) return 'Genial. Primeira tentativa.';
  if (tentativas <= 3) return 'Mandou muito bem!';
  if (tentativas <= 5) return 'Boa! Você conseguiu.';

  return 'Conseguiu!';
}

export default function Result() {
  const router = useRouter();
  const { tentativas, respostas, resetar } = useJogoStore();

  const tentativasValidas = tentativas.filter(
    (t): t is StatusJogo => t !== 'pendente'
  );

  const idxCorreto = tentativasValidas.indexOf('correto');
  const ganhou = idxCorreto !== -1;

  const total = Math.min(
    tentativasValidas.length,
    respostas.length
  );

  const gridRows = tentativasValidas
    .slice(0, total)
    .map((t) => [t]);

  const gridGuesses = respostas
    .slice(0, total)
    .map((r) => [r]);

  const scale = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShare = async () => {
    const emoji = tentativasValidas
      .slice(0, total)
      .map((t) => statusToEmoji[t])
      .join('');

    const texto = `Nivra • ${new Date().toLocaleDateString()}
${emoji}

${ganhou
        ? `Resolvi em ${idxCorreto + 1}/${tentativasValidas.length}`
        : 'Não consegui dessa vez 😔'
      }`;

    try {
      await Share.share({ message: texto });
    } catch { }
  };



  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>

        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>

          <View style={styles.header}>
            <Text style={styles.emoji}>
              {ganhou ? '🎉' : '😔'}
            </Text>

            <Text style={styles.title}>
              {ganhou ? getMensagem(ganhou, tentativasValidas.length) : 'Que pena'}
            </Text>

            <Text style={styles.subtitle}>
              {ganhou
                ? `Você resolveu em ${idxCorreto + 1} tentativa${idxCorreto > 0 ? 's' : ''}`
                : 'Não foi dessa vez'}
            </Text>
          </View>

          {/* GRID */}
          <View style={styles.gridWrapper}>
            <ResultGrid
              rows={gridRows}
              guesses={gridGuesses}
              correctIndex={idxCorreto}
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.primaryButton}
              onPress={handleShare}
            >
              <Text style={styles.primaryText}>
                Compartilhar
              </Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => {
                resetar();
                router.replace('/menu');
              }}
            >
              <Text style={styles.secondaryText}>
                Fechar
              </Text>
            </Pressable>
          </View>

        </Animated.View>

      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,

    borderWidth: 1,
    borderColor: Colors.surfaceLight,

    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
  },

  subtitle: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 4,
  },

  gridWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },

  actions: {
    gap: 12,
    marginTop: 10,
  },

  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  primaryText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },

  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  secondaryText: {
    color: Colors.secondary,
    fontSize: 14,
  },
});