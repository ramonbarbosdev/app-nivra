import { Text, View } from "react-native";

export default function QuizDesafio({ pergunta }: any) {
  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 18 }}>
        {pergunta}
      </Text>
      <Text style={{ color: '#aaa', marginTop: 8 }}>
        Escolha a alternativa correta
      </Text>
    </View>
  );
}