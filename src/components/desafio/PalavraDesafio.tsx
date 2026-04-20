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
import { usePalavraDesafio } from '@/src/hooks/usePalavraDesafio';
import { router } from 'expo-router';
import { AnswerInput } from '../AnswerInput';
import { useJogoStore } from '@/src/store/jogoStore';
import { PalavraGrid } from '../PalavraGrid';
import { Colors } from '@/src/theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PalavraDesafio({ pergunta }: any) {
    const { resposta, setResposta, erro, enviarResposta } = usePalavraDesafio();

    const tentativas = useJogoStore((s) => s.tentativas);
    const respostas = useJogoStore((s) => s.respostas);
    const setResultado = useJogoStore((s) => s.setResultado);
    const feedbacks = useJogoStore((s) => s.feedbacks);
    const desafioAtual = useJogoStore((s) => s.desafioAtual);

    const handleEnviar = async () => {
        const result = await enviarResposta();

        if (!result) return;

        if (result.finalizado) {
            const novasTentativas = [...tentativas, result.status];
            const novasRespostas = [...respostas, result.resposta].filter((r): r is string => r !== undefined);
            const novosFeedbacks = [...feedbacks, result.feedback];

            setResultado(novasTentativas, novasRespostas, novosFeedbacks);

            setTimeout(() => {
                router.replace('/result');
            }, 1000);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            // Ajuste o keyboardVerticalOffset se o header do seu app estiver cobrindo o input
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={styles.header}>
                    <Text style={styles.pergunta} numberOfLines={3}>
                        {pergunta}
                    </Text>
                    <Text style={styles.helper}>Descubra a palavra</Text>
                </View>

                <View style={styles.gridContainer}>
                    <PalavraGrid
                        respostas={respostas}
                        tentativas={tentativas}
                        feedbacks={feedbacks}
                        palavraLength={desafioAtual.nuTamanhoResposta}
                        maxTentativas={desafioAtual.nuMaximoTentativa}
                        currentInput={resposta}
                    />
                    {erro && <Text style={styles.erro}>{erro}</Text>}
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
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 30,
        paddingTop: 10,
    },
    header: {
        alignItems: 'center',
        gap: 4,
        marginBottom: SCREEN_HEIGHT < 700 ? 10 : 20,
    },
    pergunta: {
        color: Colors.primary,
        fontSize: SCREEN_HEIGHT < 700 ? 18 : 22,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 28,
    },
    helper: {
        color: Colors.secondary,
        fontSize: 13,
        letterSpacing: 0.5,
    },
    gridContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
        width: '100%',
    },
    footer: {
        width: '100%',
        marginTop: 'auto',
    },
    erro: {
        color: Colors.error,
        textAlign: 'center',
        marginTop: 12,
        fontSize: 13,
        fontWeight: '600',
        backgroundColor: `${Colors.error}15`,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
        overflow: 'hidden',
    },
});