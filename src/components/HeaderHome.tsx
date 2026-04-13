import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { useJogoStore } from "../store/jogoStore";

export default function HeaderHome() {
  const indiceAtual = useJogoStore((s) => s.indiceAtual);
  const desafios = useJogoStore((s) => s.desafios);

  const progresso =
    desafios.length > 0
      ? (indiceAtual + 1) / desafios.length
      : 0;

  return (
    <View style={styles.container}>

      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>
            Desafio diário
          </Text>

          <Text style={styles.date}>
            {new Date().toLocaleDateString("pt-BR", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* <View style={styles.streak}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>3</Text>
        </View> */}
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progresso * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {indiceAtual + 1} de {desafios.length}
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
    marginHorizontal:25
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },

  date: {
    fontSize: 12,
    color: Colors.tertiary,
    marginTop: 2,
  },

  streak: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f23",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 4,
  },

  streakEmoji: {
    fontSize: 14,
  },

  streakText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },

  progressBlock: {
    gap: 6,
  },

  progressTrack: {
    height: 6,
    backgroundColor: "#2a2a2e",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: Colors.accent,
  },

  progressText: {
    fontSize: 12,
    color: Colors.secondary,
  },
});