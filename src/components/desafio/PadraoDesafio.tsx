import { Text, View } from "react-native";

export default function PadraoDesafio({ pergunta }: any) {
  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 18 }}>
        {pergunta}
      </Text>
      <Text style={{ color: '#aaa', marginTop: 8 }}>
        Descubra o padrão
      </Text>
    </View>
  );
}