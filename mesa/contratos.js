(() => {
  const exemplosAdicionais = {
    trussardi: "Incluir uma página para outro tipo de reparo ou integrar um sistema de agendamento.",
    topsul: "Adicionar uma terceira unidade ou migrar o agendamento para outra plataforma.",
    santos: "Criar uma campanha sazonal ou montar uma galeria adicional de antes e depois.",
    zm: "Criar páginas individuais de serviços ou fazer uma nova organização da galeria.",
    eleve: "Criar uma página para um novo método ou integrar uma agenda de aulas.",
    bravus: "Criar páginas próprias para PPF e envelopamento ou ampliar o portfólio.",
    artoflife: "Incluir uma quinta unidade ou migrar os links para outra plataforma de agendamento.",
    map: "Criar uma página de campanha ou adicionar uma categoria de serviços à vitrine.",
    call: "Criar uma página independente para prótese capilar ou trocar o sistema de agendamento.",
    mov: "Adicionar uma grade de horários com edição ou uma página para um novo programa de treino.",
    jolie: "Incluir outra atividade ou trocar a ferramenta de agendamento de uma modalidade.",
    dulops: "Adicionar uma área de atendimento ou criar uma página para uma nova linha de serviços."
  };

  const taxaAdicional = "R$ 120 por hora, com mínimo de R$ 60 por pedido avulso";
  const pagamento = "50% de sinal e 50% após aprovação da prévia, antes da publicação.";
  const suporte = "Dois meses a partir da publicação para corrigir defeitos da entrega, sem custo e sem prejuízo de direitos legais aplicáveis.";
  const inicio = "assinatura, confirmação do escopo, recebimento dos materiais e pagamento do sinal";

  function pacotes(lead, proposta) {
    const completo = {
      id: "completo",
      nome: "Projeto completo",
      preco: lead.price,
      dias: "7 a 10",
      escopo: proposta.escopo,
      ajustes: "Duas rodadas consolidadas de ajustes dentro do escopo."
    };
    if (!proposta.basico) return [completo];

    const [preco, dias, escopo] = proposta.basico;
    return [completo, {
      id: "basico",
      nome: "Presença Profissional",
      preco: `R$ ${preco}`,
      dias,
      escopo: `${escopo} Até cinco seções.`,
      ajustes: "Uma rodada consolidada de ajustes simples dentro do escopo."
    }];
  }

  function minuta(lead, pacote) {
    return [
      `MINUTA DE CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO DE SITE\n${lead.name} · ${pacote.nome}`,
      `PARTES\nContratante · ${lead.name} [razão social ou nome civil], [CPF/CNPJ], [endereço], [representante e contato].\nContratada · NL Sites [razão social ou nome civil], [CPF/CNPJ], [endereço], [representante e contato].`,
      `1. ESCOPO\n${pacote.escopo} A entrega inclui layout responsivo, SEO básico (título e descrição da página), prévia para aprovação e publicação em ambiente acordado. O projeto inclui links para serviços existentes descritos no escopo. Desenvolvimento de sistemas, integrações novas e produção de fotos dependem de contratação adicional.`,
      `2. PRAZO E APROVAÇÃO\nPrazo estimado de ${pacote.dias} dias úteis após ${inicio}. A contratante fornece informações, acessos e materiais autorizados e indica uma pessoa para consolidar os retornos. A contratada confirma o início por escrito e informa eventual revisão de prazo quando aguardar materiais ou respostas da contratante. A publicação ocorre após aprovação escrita da prévia, quitação e disponibilização dos acessos necessários.`,
      `3. PREÇO E PAGAMENTO\nValor total de ${pacote.preco}. ${pagamento} Domínio, hospedagem e assinaturas de terceiros ficam à parte, mediante aceite prévio da contratante. Forma e dados de pagamento [preencher no documento final].`,
      `4. AJUSTES E SERVIÇOS ADICIONAIS\n${pacote.ajustes} Cada rodada corresponde a uma lista consolidada de ajustes na prévia. Rodadas extras, mudanças de escopo e atualizações solicitadas após a publicação são cobradas à parte. Referência para pedidos avulsos de ${taxaAdicional}. Demandas maiores podem ter preço fechado. Antes de executar, a NL Sites envia por escrito o que será feito, o preço total ou teto aprovado e o prazo revisado, e aguarda o aceite escrito. Qualquer aumento do teto exige novo aceite. Exemplos para este projeto. ${lead.extra || exemplosAdicionais[lead.slug]}`,
      `5. CORREÇÕES E MANUTENÇÃO\n${suporte} Correções de defeitos cobertos independem das rodadas de ajuste. Manutenção recorrente, quando contratada, exige instrumento separado com preço, frequência e serviços incluídos.`,
      "6. MATERIAIS E ENTREGA\nA contratante confirma as autorizações de uso dos materiais que fornecer. A NL Sites só usará materiais de terceiros sob licença compatível. Após a quitação, a contratada disponibiliza à contratante os arquivos finais da página e o direito de usá-la e adaptá-la para o seu negócio, observadas as licenças dos componentes de terceiros.",
      "7. ENCERRAMENTO\nQualquer parte pode comunicar por escrito o encerramento. As partes apuram o trabalho efetivamente realizado e as despesas previamente aprovadas, compensam os valores pagos e acertam o saldo ou a devolução cabível, respeitados os direitos e prazos previstos na legislação aplicável.",
      "ASSINATURAS\n[Cidade], [data].\nContratante [nome e assinatura]\nContratada [nome e assinatura]"
    ].join("\n\n");
  }

  window.NL_CONTRATOS = { taxaAdicional, pagamento, suporte, inicio, pacotes, minuta };
})();
