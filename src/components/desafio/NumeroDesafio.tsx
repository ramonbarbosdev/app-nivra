import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { useNumeroDesafio } from "@/src/hooks/useNumeroDesafio";
import { useJogoStore } from "@/src/store/jogoStore";
import { router } from "expo-router";
import { IndicatorTentativa } from "../IndicatorTentativa";
import { AnswerInput } from "../AnswerInput";
import { NumeroTermometro } from "../NumeroTermometro";
import { Colors } from "@/src/theme/colors";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function NumeroDesafio({ pergunta }: any) {
  const { resposta, setResposta, erro, enviarResposta } = useNumeroDesafio();

  const tentativas = useJogoStore((s) => s.tentativas);
  const respostas = useJogoStore((s) => s.respostas);
  const feedbacks = useJogoStore((s) => s.feedbacks);
  const setResultado = useJogoStore((s) => s.setResultado);

  const handleEnviar = async () => {
    const result = await enviarResposta();
    if (!result) return;

    if (result.finalizado) {
      const novasTentativas = [...tentativas, result.status];
      const novasRespostas = [...respostas, result.resposta];
      const novosFeedbacks = [...feedbacks, result.feedback ?? []];

      setResultado(novasTentativas, novasRespostas, novosFeedbacks);

      setTimeout(() => {
        router.replace('/result');
      }, 700);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.pergunta}>{pergunta}</Text>
          <Text style={styles.helper}>Tente descobrir o número</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.termometroContainer}>
            <NumeroTermometro tentativas={tentativas} />
          </View>

          <View style={styles.indicators}>
             <IndicatorTentativa tentativas={tentativas} maxTentativas={5} />
             {erro && <Text style={styles.erro}>{erro}</Text>}
          </View>
        </View>

        <View style={styles.footer}>
          <AnswerInput
            value={resposta}
            onChangeText={setResposta}
            onSubmit={handleEnviar}
            error={!!erro}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    // Garante um espaço mínimo para telas muito pequenas
    minHeight: SCREEN_HEIGHT * 0.6, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pergunta: {
    color: Colors.primary,
    fontSize: SCREEN_HEIGHT < 700 ? 18 : 22, // Fonte menor em telas pequenas
    fontWeight: '700',
    textAlign: 'center',
  },
  helper: {
    color: Colors.secondary,
    fontSize: 14,
    marginTop: 4,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  termometroContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150, // Garante que o termômetro apareça bem
  },
  indicators: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  footer: {
    width: '100%',
    marginTop: 'auto', // Empurra para o final
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
  },
  erro: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600'
  },
});