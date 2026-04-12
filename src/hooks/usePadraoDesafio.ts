import { useBaseDesafio } from './useBaseDesafio';
import { useJogoStore } from '@/src/store/jogoStore';

export const usePadraoDesafio = () => {
  const base = useBaseDesafio();
  const tentativas = useJogoStore((s) => s.tentativas);

  const enviarResposta = async () => {
    const result = await base.enviar();
    if (!result) return;

    const finalizado =
      result.sucesso || tentativas.length + 1 >= 5;

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