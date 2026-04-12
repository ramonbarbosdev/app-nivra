import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export function NumeroTermometro({ tentativas }: any) {
  const position = useSharedValue(0);

  useEffect(() => {
    if (!tentativas.length) return;

    const last = tentativas[tentativas.length - 1];

    if (last === 'alto') {
      position.value = withTiming(1, { duration: 400 });
    } else if (last === 'baixo') {
      position.value = withTiming(-1, { duration: 400 });
    } else if (last === 'correto') {
      position.value = withTiming(0, { duration: 400 });
    }
  }, [tentativas]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: position.value * -80, 
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.labelTop}>ALTO</Text>

      <View style={styles.track}>
        <Animated.View style={[styles.indicator, animatedStyle]} />
      </View>

      <Text style={styles.labelBottom}>BAIXO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },

  track: {
    height: 160,
    width: 40,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  indicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22c55e',
    position: 'absolute',
  },

  labelTop: {
    color: '#aaa',
    marginBottom: 8,
  },

  labelBottom: {
    color: '#aaa',
    marginTop: 8,
  },
});