const CONFIG_ALUNO = {
  turma: "8B",
  numeroChamada: 37,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Dados locais legados / fallback
const dadosDisciplinasLocais = [
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

let dadosAtuais = [];
let sessaoPin = "";

// Normalização para dados antigos/locais ou recebidos da API
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  if (typeof valor === 'string') {
    valor = valor.replace(',', '.').trim();
    if (valor === "") return null;
  }
  let num = Number(valor);
  if (isNaN(num) || num < 0 || num > 100) {
    return null;
  }
  if (num >= 0 && num <= 10) {
    return num;
  }
  if (num > 10 && num <= 100) {
    return num / 10;
  }
  return null;
}

function formatarExibicaoNota(nota) {
  if (nota === null || nota === undefined) {
    return "—";
  }
  return Number(nota).toFixed(1).replace('.', ',');
}

function renderizarBoletim() {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = "";

  let somaMediasGerais = 0;
  let totalDisciplinasComMedia = 0;
  let acumuladorTotalFaltas = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  dadosAtuais.forEach(item => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    let arrFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const totalFaltasDisciplina = arrFaltas.reduce((acc, f) => acc + (Number(f) || 0), 0);
    acumuladorTotalFaltas += totalFaltasDisciplina;

    let notasValidas = [];
    if (n1 !== null) notasValidas.push(n1);
    if (n2 !== null) notasValidas.push(n2);
    if (n3 !== null) notasValidas.push(n3);

    let mediaDisciplina = null;
    let situacao = "Nota ainda não disponível";
    let classeSituacao = "situacao-indisponivel";

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

    const tr = document.createElement("tr");

    const tdDisc = document.createElement("td");
    const strongDisc = document.createElement("strong");
    strongDisc.textContent = item.disciplina || "";
    tdDisc.appendChild(strongDisc);
    tr.appendChild(tdDisc);

    const td1 = document.createElement("td");
    td1.textContent = formatarExibicaoNota(n1);
    tr.appendChild(td1);

    const td2 = document.createElement("td");
    td2.textContent = formatarExibicaoNota(n2);
    tr.appendChild(td2);

    const td3 = document.createElement("td");
    td3.textContent = formatarExibicaoNota(n3);
    tr.appendChild(td3);

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = mediaDisciplina !== null ? mediaDisciplina.toFixed(1).replace('.', ',') : "—";
    tdMedia.appendChild(strongMedia);
    tr.appendChild(tdMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = totalFaltasDisciplina;
    tr.appendChild(tdFaltas);

    const tdSituacao = document.createElement("td");
    tdSituacao.className = classeSituacao;
    tdSituacao.textContent = situacao;
    tr.appendChild(tdSituacao);

    corpoTabela.appendChild(tr);
  });

  const mediaGeralCalculada = totalDisciplinasComMedia > 0
    ? (somaMediasGerais / totalDisciplinasComMedia).toFixed(1).replace('.', ',')
    : "—";

  document.getElementById("media-geral").textContent = mediaGeralCalculada;
  document.getElementById("total-faltas").textContent = acumuladorTotalFaltas;
  document.getElementById("bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("precisa-atencao").textContent = qtdAtencao;

  document.getElementById("frequencia-geral").textContent = "92%";
  document.getElementById("status-frequencia").textContent = "Frequência adequada";
}

async function fazerLogin() {
  const pinInput = document.getElementById("pin-input");
  const msgLogin = document.getElementById("mensagem-login");
  const pinDigitado = pinInput.value.trim();

  if (!pinDigitado) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Por favor, digite o PIN.";
    return;
  }

  msgLogin.className = "mensagem-status info";
  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const resultado = await resposta.json();

    sessaoPin = pinDigitado;
    pinInput.value = "";

    if (resultado.dados && Array.isArray(resultado.dados.disciplinas)) {
      dadosAtuais = resultado.dados.disciplinas;
    } else {
      dadosAtuais = JSON.parse(JSON.stringify(dadosDisciplinasLocais));
    }

    document.getElementById("area-login").style.display = "none";
    document.getElementById("conteudo-boletim").style.display = "block";
    renderizarBoletim();

  } catch (erro) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

function abrirModalEdicao() {
  const corpoTabelaEdicao = document.getElementById("corpo-tabela-edicao");
  corpoTabelaEdicao.innerHTML = "";
  document.getElementById("mensagem-edicao").textContent = "";
  document.getElementById("mensagem-edicao").className = "mensagem-status";

  dadosAtuais.forEach((item, idx) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const arrFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const f1 = arrFaltas[0] !== undefined ? arrFaltas[0] : 0;
    const f2 = arrFaltas[1] !== undefined ? arrFaltas[1] : 0;
    const f3 = arrFaltas[2] !== undefined ? arrFaltas[2] : 0;

    const tr = document.createElement("tr");

    const tdDisc = document.createElement("td");
    const strongDisc = document.createElement("strong");
    strongDisc.textContent = item.disciplina || "";
    tdDisc.appendChild(strongDisc);
    tr.appendChild(tdDisc);

    const criadorInput = (valor, classe) => {
      const input = document.createElement("input");
      input.type = "text";
      input.className = classe;
      input.value = valor !== null && valor !== undefined ? String(valor).replace('.', ',') : "";
      return input;
    };

    const criadorInputFalta = (valor) => {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "input-falta";
      input.value = valor !== null && valor !== undefined ? String(valor) : "0";
      return input;
    };

    const tdN1 = document.createElement("td");
    const inN1 = criadorInput(n1, "input-nota-1");
    tdN1.appendChild(inN1);
    tr.appendChild(tdN1);

    const tdN2 = document.createElement("td");
    const inN2 = criadorInput(n2, "input-nota-2");
    tdN2.appendChild(inN2);
    tr.appendChild(tdN2);

    const tdN3 = document.createElement("td");
    const inN3 = criadorInput(n3, "input-nota-3");
    tdN3.appendChild(inN3);
    tr.appendChild(tdN3);

    const tdF1 = document.createElement("td");
    const inF1 = criadorInputFalta(f1);
    tdF1.appendChild(inF1);
    tr.appendChild(tdF1);

    const tdF2 = document.createElement("td");
    const inF2 = criadorInputFalta(f2);
    tdF2.appendChild(inF2);
    tr.appendChild(tdF2);

    const tdF3 = document.createElement("td");
    const inF3 = criadorInputFalta(f3);
    tdF3.appendChild(inF3);
    tr.appendChild(tdF3);

    tr.dataset.index = idx;
    corpoTabelaEdicao.appendChild(tr);
  });

  document.getElementById("modal-edicao").style.display = "flex";
}

function fecharModalEdicao() {
  document.getElementById("modal-edicao").style.display = "none";
}

function validarNota(valorStr) {
  const str = valorStr.trim();
  if (str === "") {
    return { valido: true, valor: null };
  }
  const strPadronizada = str.replace(',', '.');
  const num = Number(strPadronizada);
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false, valor: null };
  }
  return { valido: true, valor: num };
}

function validarFalta(valorStr) {
  const str = valorStr.trim();
  if (str === "") {
    return { valido: false, valor: null };
  }
  const num = Number(str);
  if (isNaN(num) || !Number.isInteger(num) || num < 0) {
    return { valido: false, valor: null };
  }
  return { valido: true, valor: num };
}

async function salvarAlteracoes() {
  const msgEdicao = document.getElementById("mensagem-edicao");
  msgEdicao.className = "mensagem-status";
  msgEdicao.textContent = "";

  const linhas = document.querySelectorAll("#corpo-tabela-edicao tr");
  let temErro = false;

  document.querySelectorAll("#corpo-tabela-edicao input").forEach(inp => inp.classList.remove("campo-invalido"));

  const novasDisciplinas = [];

  linhas.forEach((tr) => {
    const idx = tr.dataset.index;
    const nomeDisciplina = dadosAtuais[idx].disciplina;

    const inN1 = tr.querySelector(".input-nota-1");
    const inN2 = tr.querySelector(".input-nota-2");
    const inN3 = tr.querySelector(".input-nota-3");

    const inputsFaltas = tr.querySelectorAll(".input-falta");
    const inF1 = inputsFaltas[0];
    const inF2 = inputsFaltas[1];
    const inF3 = inputsFaltas[2];

    const valN1 = validarNota(inN1.value);
    const valN2 = validarNota(inN2.value);
    const valN3 = validarNota(inN3.value);

    const valF1 = validarFalta(inF1.value);
    const valF2 = validarFalta(inF2.value);
    const valF3 = validarFalta(inF3.value);

    if (!valN1.valido) { inN1.classList.add("campo-invalido"); temErro = true; }
    if (!valN2.valido) { inN2.classList.add("campo-invalido"); temErro = true; }
    if (!valN3.valido) { inN3.classList.add("campo-invalido"); temErro = true; }

    if (!valF1.valido) { inF1.classList.add("campo-invalido"); temErro = true; }
    if (!valF2.valido) { inF2.classList.add("campo-invalido"); temErro = true; }
    if (!valF3.valido) { inF3.classList.add("campo-invalido"); temErro = true; }

    if (!temErro) {
      novasDisciplinas.push({
        disciplina: nomeDisciplina,
        tri1: valN1.valor,
        tri2: valN2.valor,
        tri3: valN3.valor,
        faltas: [valF1.valor, valF2.valor, valF3.valor]
      });
    }
  });

  if (temErro) {
    msgEdicao.className = "mensagem-status erro";
    msgEdicao.textContent = "Existem campos com valores inválidos. Verifique os destaques em vermelho.";
    return;
  }

  msgEdicao.className = "mensagem-status info";
  msgEdicao.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: sessaoPin,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      msgEdicao.className = "mensagem-status erro";
      msgEdicao.textContent = "Erro ao salvar alterações no servidor. Tente novamente.";
      return;
    }

    dadosAtuais = novasDisciplinas;
    renderizarBoletim();
    fecharModalEdicao();
    alert("Dados salvos com sucesso.");

  } catch (erro) {
    msgEdicao.className = "mensagem-status erro";
    msgEdicao.textContent = "Erro de conexão ao salvar. Tente novamente.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-entrar").addEventListener("click", fazerLogin);

  document.getElementById("pin-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fazerLogin();
    }
  });

  document.getElementById("btn-alterar-dados").addEventListener("click", abrirModalEdicao);
  document.getElementById("btn-cancelar-edicao").addEventListener("click", fecharModalEdicao);
  document.getElementById("btn-salvar-dados").addEventListener("click", salvarAlteracoes);
});