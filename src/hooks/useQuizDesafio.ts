import { useBaseDesafio } from './useBaseDesafio';

export const useQuizDesafio = () => {
  const base = useBaseDesafio();

  const enviarResposta = async (opcao: string) => {
    base.setResposta(opcao);

    const result = await base.enviar();

    if (!result) return;

    return {
      ...result,
      finalizado: true, // quiz sempre encerra
    };
  };

  return {
    ...base,
    enviarResposta,
  };
};