import React, { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/src/theme/colors";
import { useQuizDesafio } from "@/src/hooks/useQuizDesafio";
import { useJogoStore } from "@/src/store/jogoStore";
import { router } from "expo-router";

export default function QuizDesafio() {
  const { enviarResposta, erro } = useQuizDesafio();
  
  const desafioBruto = useJogoStore((s) => s.desafioAtual);
  const desafio = Array.isArray(desafioBruto) ? desafioBruto[0] : desafioBruto;
  
  const tentativas = useJogoStore((s) => s.tentativas);
  const respostas = useJogoStore((s) => s.respostas);
  const feedbacks = useJogoStore((s) => s.feedbacks);
  const setResultado = useJogoStore((s) => s.setResultado);

  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [statusLocal, setStatusLocal] = useState<string | null>(null);

  if (!desafio?.conteudo?.opcoes) return null;

  const handleVerificar = async () => {
    if (!selecionado || carregando || statusLocal) return;

    setCarregando(true);
    const result = await enviarResposta(selecionado);
    setCarregando(false);

    if (!result) return;

    setStatusLocal(result.status);

    if (result.finalizado) {
      const novasTentativas = [...tentativas, result.status];
       const novasRespostas = [...respostas, result.resposta].filter((r): r is string => r !== undefined);
      const novosFeedbacks = [...feedbacks, [result.feedback || ""]];

      setResultado(novasTentativas, novasRespostas, novosFeedbacks);

      setTimeout(() => {
        router.replace("/result");
      }, 1200);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.pergunta}>{desafio.dsPergunta}</Text>
          <Text style={styles.helper}>Selecione a alternativa correta</Text>
        </View>

        <View style={styles.optionsContainer}>
          {desafio.conteudo.opcoes.map((item: any, index: number) => {
            const isSelected = selecionado === item.nmRotulo;
            const isCorreto = statusLocal === "correto" && isSelected;
            const isErrado = statusLocal === "errado" && isSelected;

            return (
              <Pressable
                key={index}
                disabled={!!statusLocal} 
                onPress={() => setSelecionado(item.nmRotulo)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionSelected,
                  isCorreto && styles.optionCorrect,
                  isErrado && styles.optionWrong,
                ]}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.letterBox,
                    isSelected && { backgroundColor: Colors.button }
                  ]}>
                    <Text style={styles.letterText}>{item.cdOpcao}</Text>
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.textWhite]}>
                    {item.nmRotulo}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {erro && <Text style={styles.erroText}>{erro}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleVerificar}
          disabled={!selecionado || !!statusLocal || carregando}
          style={[
            styles.button,
            (!selecionado || statusLocal || carregando) && styles.buttonDisabled
          ]}
        >
          <Text style={styles.buttonText}>
            {carregando ? "ENVIANDO..." : "VERIFICAR"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    height: "80%", 
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  pergunta: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  helper: {
    color: Colors.secondary,
    fontSize: 14,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  letterBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  letterText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  optionText: {
    color: Colors.secondary,
    fontSize: 16,
    flex: 1, 
    flexWrap: 'wrap',
  },
  textWhite: {
    color: Colors.primary,
    fontWeight: '600',
  },
  optionSelected: {
    borderColor: Colors.button,
    backgroundColor: Colors.surfaceLight,
  },
  optionCorrect: {
    borderColor: Colors.accent,
    backgroundColor: '#1c3329',
  },
  optionWrong: {
    borderColor: Colors.error,
    backgroundColor: '#331c26',
  },
  erroText: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    paddingVertical: 10,
  },
  button: {
    backgroundColor: Colors.button,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: Colors.gray,
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});