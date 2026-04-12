import { usePalavraDesafio } from '@/src/hooks/usePalavraDesafio';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnswerInput } from '../AnswerInput';
import { IndicatorTentativa } from '../IndicatorTentativa';
import { useJogoStore } from '@/src/store/jogoStore';

export default function PalavraDesafio({ pergunta }: any) {

  const { resposta, setResposta, erro, enviarResposta } = usePalavraDesafio();

  const tentativas = useJogoStore((s) => s.tentativas);
  const respostas = useJogoStore((s) => s.respostas);
  const setResultado = useJogoStore((s) => s.setResultado);

  const handleEnviar = async () => {
    const result = await enviarResposta();
    if (!result) return;

    if (result.finalizado) {
      const novasTentativas = [...tentativas, result.status];

      setResultado(novasTentativas, respostas);

      router.replace('/result');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.pergunta}>{pergunta}</Text>
        <Text style={styles.helper}>Digite uma palavra</Text>
      </View>

      <IndicatorTentativa tentativas={tentativas} maxTentativas={5} />

      {erro && <Text style={styles.erro}>{erro}</Text>}

      <AnswerInput
        value={resposta}
        onChangeText={setResposta}
        onSubmit={handleEnviar}
        error={!!erro}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  pergunta: { color: '#fff', fontSize: 18 },
  helper: { color: '#aaa', marginTop: 8 },
  erro: { color: 'red', textAlign: 'center' },
});