import { Text, View } from "react-native";

export default function NumeroDesafio({ pergunta }: any) {
  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 18 }}>
        {pergunta}
      </Text>
      <Text style={{ color: '#aaa', marginTop: 8 }}>
        Tente adivinhar o número
      </Text>
    </View>
  );
}