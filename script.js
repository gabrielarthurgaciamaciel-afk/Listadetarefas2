const formulario = document.querySelector('#form-tarefa');
const entrada = document.querySelector('#entrada-tarefa');
const lista = document.querySelector('#lista-tarefas');
const mensagemVazia = document.querySelector('#mensagem-vazia');
const contadorPendentes = document.querySelector('#contador-pendentes');
const contadorConcluidas = document.querySelector('#contador-concluidas');
const progresso = document.querySelector('#progresso');
const botoesFiltro = document.querySelectorAll('.filtro');

let tarefas = JSON.parse(localStorage.getItem('minhasTarefas')) || [];
let filtroAtual = 'todas';

// Salva as tarefas no navegador
function salvarTarefas() {
  localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
}

// Cria uma nova tarefa
function criarTarefa(texto) {
  return {
    id: Date.now() + Math.random(),
    texto: texto,
    concluida: false
  };
}

// Mostra as tarefas na página
function renderizarTarefas() {
  lista.innerHTML = '';

  const tarefasVisiveis = tarefas.filter((tarefa) => {
    if (filtroAtual === 'pendentes') {
      return !tarefa.concluida;
    }
    if (filtroAtual === 'concluidas') {
      return tarefa.concluida;
    }
    return true;
  });

  tarefasVisiveis.forEach((tarefa) => {
    const item = document.createElement('li');
    item.className = `tarefa ${tarefa.concluida ? 'concluida' : ''}`;

    // Botão para concluir a tarefa
    const botaoConcluir = document.createElement('button');
    botaoConcluir.className = 'checkbox-tarefa';
    botaoConcluir.type = 'button';
    botaoConcluir.textContent = tarefa.concluida ? '✓' : '';
    botaoConcluir.addEventListener('click', () => {
      alternarConclusao(tarefa.id);
    });

    // Texto da tarefa
    const texto = document.createElement('span');
    texto.className = 'texto-tarefa';
    texto.textContent = tarefa.texto;

    // Botão para remover a tarefa
    const botaoRemover = document.createElement('button');
    botaoRemover.className = 'botao-remover';
    botaoRemover.type = 'button';
    botaoRemover.textContent = '✕';
    botaoRemover.title = 'Remover tarefa';
    botaoRemover.addEventListener('click', () => {
      removerTarefa(tarefa.id);
    });

    item.append(botaoConcluir, texto, botaoRemover);
    lista.appendChild(item);
  });

  // Atualiza os contadores
  const concluidas = tarefas.filter((tarefa) => tarefa.concluida).length;
  const pendentes = tarefas.length - concluidas;

  contadorPendentes.textContent = `${pendentes} ${
    pendentes === 1 ? 'tarefa pendente' : 'tarefas pendentes'
  }`;
  contadorConcluidas.textContent = `${concluidas} ${
    concluidas === 1 ? 'concluída' : 'concluídas'
  }`;

  // CORREÇÃO AQUI: Adicionadas as crases (Template Literals) para funcionar
  const porcentagem = tarefas.length ? (concluidas / tarefas.length) * 100 : 0;
  progresso.style.width = `${porcentagem}%`;

  // Mensagem quando não existem tarefas
  mensagemVazia.hidden = tarefasVisiveis.length > 0;

  if (tarefasVisiveis.length === 0) {
    if (tarefas.length === 0) {
      mensagemVazia.textContent = 'Sua lista está vazia. Adicione uma tarefa para começar!';
    } else if (filtroAtual === 'pendentes') {
      mensagemVazia.textContent = 'Você não tem tarefas pendentes. Muito bem!';
    } else {
      mensagemVazia.textContent = 'Ainda não há tarefas para mostrar.';
    }
  }

  // Destaca o filtro selecionado
  botoesFiltro.forEach((botao) => {
    const ativo = botao.dataset.filtro === filtroAtual;
    botao.classList.toggle('ativo', ativo);
    botao.setAttribute('aria-pressed', String(ativo));
  });
}

// Adiciona uma tarefa
function adicionarTarefa(texto) {
  const textoLimpo = texto.trim();
  if (!textoLimpo) {
    return;
  }

  tarefas.unshift(criarTarefa(textoLimpo));
  salvarTarefas();
  renderizarTarefas();
}

// Marca ou desmarca uma tarefa
function alternarConclusao(id) {
  tarefas = tarefas.map((tarefa) => {
    if (tarefa.id === id) {
      return { ...tarefa, concluida: !tarefa.concluida };
    }
    return tarefa;
  });
  salvarTarefas();
  renderizarTarefas();
}

// Remove uma tarefa
function removerTarefa(id) {
  tarefas = tarefas.filter((tarefa) => tarefa.id !== id);
  salvarTarefas();
  renderizarTarefas();
}

// Evento do formulário
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  adicionarTarefa(entrada.value);
  entrada.value = '';
  entrada.focus();
});

// Eventos dos filtros
botoesFiltro.forEach((botao) => {
  botao.addEventListener('click', () => {
    filtroAtual = botao.dataset.filtro;
    renderizarTarefas();
  });
});

// Exibe as tarefas ao abrir a página
renderizarTarefas();
