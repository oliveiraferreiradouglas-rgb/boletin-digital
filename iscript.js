// Array de objetos com os dados brutos fictícios das disciplinas do 8º Ano
const dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// Função responsável por normalizar as notas para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se o valor vier como texto com vírgula, troca por ponto
  if (typeof valor === 'string') {
    valor = valor.replace(',', '.').trim();
  }

  let num = Number(valor);

  // Se for um valor inválido ou fora do limite de 0 a 100
  if (isNaN(num) || num < 0 || num > 100) {
    return null;
  }

  // Se o valor já está entre 0 e 10
  if (num >= 0 && num <= 10) {
    return num;
  }

  // Se o valor está entre 10 e 100, divide por 10
  if (num > 10 && num <= 100) {
    return num / 10;
  }

  return null;
}

// Formata a exibição da nota (ex: 8.2) ou exibe "—" se for ausente
function formatarExibicaoNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace('.', ',');
}

// Função principal que gera a tabela e atualiza os cards no DOM
function carregarBoletim() {
  const corpoTabela = document.getElementById("corpo-tabela");

  let somaMediasGerais = 0;
  let totalDisciplinasComMedia = 0;
  let acumuladorTotalFaltas = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  corpoTabela.innerHTML = "";

  // forEach: percorre todas as 15 disciplinas
  dadosDisciplinas.forEach(item => {
    // Normaliza a nota de cada um dos 3 trimestres
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Soma as faltas dos três trimestres da disciplina
    const totalFaltasDisciplina = item.faltas.reduce((acc, f) => acc + f, 0);
    acumuladorTotalFaltas += totalFaltasDisciplina;

    // Guarda apenas as notas que estão lançadas/válidas
    let notasValidas = [];
    if (n1 !== null) notasValidas.push(n1);
    if (n2 !== null) notasValidas.push(n2);
    if (n3 !== null) notasValidas.push(n3);

    let mediaDisciplina = null;
    let situacao = "Nota ainda não disponível";
    let classeSituacao = "situacao-indisponivel";

    // Calcula a média se houver pelo menos uma nota lançada
    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((a, b) => a + b, 0);
      mediaDisciplina = soma / notasValidas.length;
      somaMediasGerais += mediaDisciplina;
      totalDisciplinasComMedia++;

      if (mediaDisciplina >= 6.0) {
        situacao = "Bom desempenho";
        classeSituacao = "situacao-bom";
        qtdBomDesempenho++;
      } else {
        situacao = "Atenção";
        classeSituacao = "situacao-atencao";
        qtdAtencao++;
      }
    }

    // Cria a linha da tabela no HTML via DOM
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarExibicaoNota(n1)}</td>
      <td>${formatarExibicaoNota(n2)}</td>
      <td>${formatarExibicaoNota(n3)}</td>
      <td><strong>${mediaDisciplina !== null ? mediaDisciplina.toFixed(1).replace('.', ',') : "—"}</strong></td>
      <td>${totalFaltasDisciplina}</td>
      <td class="${classeSituacao}">${situacao}</td>
    `;

    corpoTabela.appendChild(tr);
  });

  // Atualização dos Cards de Resumo
  const mediaGeralCalculada = totalDisciplinasComMedia > 0
    ? (somaMediasGerais / totalDisciplinasComMedia).toFixed(1).replace('.', ',')
    : "—";

  document.getElementById("media-geral").textContent = mediaGeralCalculada;
  document.getElementById("total-faltas").textContent = acumuladorTotalFaltas;
  document.getElementById("bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("precisa-atencao").textContent = qtdAtencao;

  // ESTA FREQUÊNCIA DE 92% É APENAS FICTÍCIA/DEMONSTRATIVA PARA ESTA ETAPA
  // E SERÁ CALCULADA DE OUTRA FORMA NO FUTURO
  document.getElementById("frequencia-geral").textContent = "92%";
  document.getElementById("status-frequencia").textContent = "Frequência adequada";
}

// Executa a função quando o HTML terminar de carregar
document.addEventListener("DOMContentLoaded", carregarBoletim);