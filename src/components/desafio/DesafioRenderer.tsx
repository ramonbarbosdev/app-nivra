import { TipoDesafio } from '@/src/types/TipoDesafio';
import React from 'react';
import PalavraDesafio from './PalavraDesafio';
import NumeroDesafio from './NumeroDesafio';
import QuizDesafio from './QuizDesafio';
import PadraoDesafio from './PadraoDesafio';


interface Props {
  tipo: TipoDesafio;
  pergunta: string;
}

export default function DesafioRenderer({ tipo, pergunta }: Props) {
  switch (tipo) {
    case 'PALAVRA':
      return <PalavraDesafio pergunta={pergunta} />;

    case 'NUMERO':
      return <NumeroDesafio pergunta={pergunta} />;

    case 'QUIZ':
      return <QuizDesafio pergunta={pergunta} />;

    case 'PADRAO':
      return <PadraoDesafio pergunta={pergunta} />;

    default:
      return null;
  }
}