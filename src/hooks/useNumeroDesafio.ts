import { useBaseDesafio } from './useBaseDesafio';
import { useJogoStore } from '@/src/store/jogoStore';

const MAX = 5;

export const useNumeroDesafio = () => {
  const base = useBaseDesafio();
  const tentativas = useJogoStore((s) => s.tentativas);

  const enviarResposta = async () => {
    const result = await base.enviar();
    if (!result) return;

    const finalizado =
      result.sucesso || tentativas.length + 1 >= MAX;

    return {
      ...result,
      finalizado,
    };
  };

  return {
    ...base,
    enviarResposta,
  };
};