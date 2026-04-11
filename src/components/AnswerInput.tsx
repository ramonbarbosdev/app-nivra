import React, { useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  Pressable,
  Text,
} from 'react-native';
import { Colors } from '../theme/colors';

interface AnswerInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  error?: boolean; // 🔥 novo
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  disabled,
  error = false,
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  // 🔥 animação de erro (shake)
  const shake = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shake, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -5, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 5, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [error]);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateX: shake }],
        width: '100%',
      }}
    >
      <View style={styles.container}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError, // 🔥 highlight vermelho
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder="Sua resposta"
          placeholderTextColor={Colors.tertiary}
          keyboardType="default"
          autoCorrect={false}
          editable={!disabled}
          onSubmitEditing={onSubmit}
          returnKeyType="done"
        />

        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable
            onPress={onSubmit}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={disabled || !value.trim()}
            style={[
              styles.button,
              (!value.trim() || disabled) && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>Verificar</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    gap: 16,
    width: '100%',
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 2,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  // 🔥 estado de erro
  inputError: {
    borderColor: '#ff4d4f',
    borderWidth: 2,
  },
  button: {
    backgroundColor: Colors.button,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});