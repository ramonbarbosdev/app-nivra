import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/src/theme/colors';

function getMsAteMeiaNoite() {
    const agora = new Date();
    const meiaNoite = new Date(agora);
    meiaNoite.setDate(agora.getDate() + 1);
    meiaNoite.setHours(0, 0, 0, 0);
    return Math.max(0, meiaNoite.getTime() - agora.getTime());
}

function formatarContador(ms: number) {
    const totalSegundos = Math.floor(ms / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return { horas, minutos, segundos };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    const display = String(value).padStart(2, '0');
    return (
        <View style={timeStyles.unit}>
            <View style={timeStyles.box}>
                <Text style={timeStyles.number}>{display}</Text>
            </View>
            <Text style={timeStyles.label}>{label}</Text>
        </View>
    );
}

const timeStyles = StyleSheet.create({
    unit: { alignItems: 'center', gap: 6 },
    box: {
        backgroundColor: Colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.gray,
        paddingVertical: 14,
        paddingHorizontal: 18,
        minWidth: 72,
        alignItems: 'center',
    },
    number: {
        color: Colors.primary,
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: -1,
    },
    label: {
        color: Colors.tertiary,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2,
    },
});

export default function EmptyState() {
    const [tempoRestante, setTempoRestante] = useState(getMsAteMeiaNoite);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(32)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.3)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 11, useNativeDriver: true }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 0.7, duration: 2200, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0.3, duration: 2200, useNativeDriver: true }),
            ])
        ).start();

        const interval = setInterval(() => {
            const restante = getMsAteMeiaNoite();
            setTempoRestante(restante);
            if (restante <= 0) router.replace('/start');
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const { horas, minutos, segundos } = useMemo(
        () => formatarContador(tempoRestante),
        [tempoRestante]
    );

    const onPressIn = () =>
        Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
    const onPressOut = () =>
        Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

    return (
        <SafeAreaView style={styles.safe}>
            {/* Ambient orb — accent green, different from other screens */}
            <Animated.View style={[styles.orbTop, { opacity: glowAnim, transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.orbBottom} />

            <Animated.View
                style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
            >
                {/* Icon */}
                <View style={styles.iconRing}>
                    <View style={styles.iconInner}>
                        <Ionicons name="moon-outline" size={32} color={Colors.accent} />
                    </View>
                </View>

                {/* Label */}
                <View style={styles.labelRow}>
                    <View style={[styles.labelDot, { backgroundColor: Colors.accent }]} />
                    <Text style={styles.labelText}>TODOS CONCLUÍDOS</Text>
                </View>

                <Text style={styles.title}>Você zerou{'\n'}o dia de hoje</Text>

                <Text style={styles.subtitle}>
                    Novos desafios desbloqueiam à meia-noite.{'\n'}Volte amanhã para continuar.
                </Text>

                {/* Countdown */}
                <View style={styles.countdownBlock}>
                    <View style={styles.countdownHeader}>
                        <View style={styles.cardLabelRow}>
                            <View style={[styles.cardLabelDot, { backgroundColor: Colors.button }]} />
                            <Text style={styles.cardLabelText}>PRÓXIMO DESAFIO EM</Text>
                        </View>
                    </View>

                    <View style={styles.timeRow}>
                        <TimeUnit value={horas} label="HORAS" />
                        <Text style={styles.timeSeparator}>:</Text>
                        <TimeUnit value={minutos} label="MIN" />
                        <Text style={styles.timeSeparator}>:</Text>
                        <TimeUnit value={segundos} label="SEG" />
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <View style={styles.dividerDiamond} />
                    <View style={styles.dividerLine} />
                </View>

                {/* CTA */}
                <Animated.View style={[styles.buttonWrap, { transform: [{ scale: buttonScale }] }]}>
                    <Pressable
                        style={styles.button}
                        onPress={() => router.replace('/start')}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                    >
                        <View style={styles.buttonGlow} />
                        <Text style={styles.buttonText}>Verificar novamente</Text>
                        <View style={styles.buttonArrow}>
                            <Text style={styles.buttonArrowText}>↺</Text>
                        </View>
                    </Pressable>
                </Animated.View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    orbTop: {
        position: 'absolute',
        top: -80,
        left: -80,
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: Colors.accent,
        opacity: 0.15,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 100,
    },
    orbBottom: {
        position: 'absolute',
        bottom: -100,
        right: -80,
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: Colors.button,
        opacity: 0.1,
        shadowColor: Colors.button,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 80,
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
        gap: 0,
    },

    iconRing: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 1,
        borderColor: `${Colors.accent}44`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        backgroundColor: `${Colors.accent}11`,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
    },
    iconInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: `${Colors.accent}18`,
        justifyContent: 'center',
        alignItems: 'center',
    },

    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    labelDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    labelText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 3,
        color: Colors.accent,
    },

    title: {
        color: Colors.primary,
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.5,
        lineHeight: 38,
        marginBottom: 12,
    },

    subtitle: {
        color: Colors.secondary,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 36,
    },

    // Countdown card
    countdownBlock: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.gray,
        alignItems: 'center',
        marginBottom: 28,
        gap: 18,
    },
    countdownHeader: {
        width: '100%',
    },
    cardLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardLabelDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    cardLabelText: {
        color: Colors.secondary,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 2,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    timeSeparator: {
        color: Colors.tertiary,
        fontSize: 28,
        fontWeight: '800',
        marginTop: 10,
    },

    // Divider
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        marginBottom: 28,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.gray,
    },
    dividerDiamond: {
        width: 6,
        height: 6,
        borderRadius: 1,
        backgroundColor: Colors.button,
        transform: [{ rotate: '45deg' }],
    },

    // Button
    buttonWrap: { width: '100%' },
    button: {
        backgroundColor: Colors.button,
        paddingVertical: 18,
        paddingHorizontal: 28,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: Colors.button,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        gap: 12,
    },
    buttonGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    buttonText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.2,
    },
    buttonArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonArrowText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '700',
    },
});