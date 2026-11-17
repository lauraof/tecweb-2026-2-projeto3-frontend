import api, { ApiError } from './api.js'
import homeMock from '../data/homeMock.js'

const CODIGOS_DIA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
const USUARIO_ID = import.meta.env.VITE_USUARIO_ID || '1'

function opcoesDaRequisicao(signal) {
  return {
    signal,
    headers: {
      'X-Usuario-Id': USUARIO_ID,
    },
  }
}

function diasDoHabito(diasSemana) {
  if (Array.isArray(diasSemana)) {
    return diasSemana
  }

  return String(diasSemana || '')
    .split(',')
    .map((dia) => dia.trim())
    .filter(Boolean)
}

function normalizarHabito(habito) {
  return {
    id: habito.id,
    nome: habito.nome,
    descricao: habito.descricao || 'Hábito programado para hoje.',
    diasSemana: diasDoHabito(habito.dias_semana),
    concluido: Boolean(habito.concluido),
    recompensaXp: habito.recompensa_xp ?? 4,
  }
}

function filtrarHabitosDeHoje(habitos, data = new Date()) {
  const codigoHoje = CODIGOS_DIA[data.getDay()]

  return habitos
    .map(normalizarHabito)
    .filter((habito) => habito.diasSemana.includes(codigoHoje))
}

function normalizarHomeDaApi(resposta) {
  const usuario = resposta.usuario || {}
  const treino = resposta.treino || null
  const progresso = resposta.progresso || {}

  return {
    usuario: {
      nome: usuario.nome || 'Usuário',
      nivel: usuario.nivel ?? 1,
      xp: usuario.xp ?? 0,
      xpNoNivel: usuario.xp_no_nivel ?? usuario.xpNoNivel ?? 0,
      xpParaProximoNivel:
        usuario.xp_para_proximo_nivel ?? usuario.xpParaProximoNivel ?? 100,
      gemas: usuario.gemas ?? 0,
      streak: usuario.streak ?? 0,
    },
    treino: treino
      ? {
          id: treino.id,
          nome: treino.nome || 'Treino do dia',
          titulo: treino.titulo || treino.nome || 'Treino do dia',
          quantidadeExercicios:
            treino.quantidade_exercicios ?? treino.exercicios?.length ?? 0,
          duracaoMinutos: treino.duracao_minutos ?? 0,
          exerciciosConcluidos: treino.exercicios_concluidos ?? 0,
          recompensaXp: treino.recompensa_xp ?? 0,
          recompensaGemas: treino.recompensa_gemas ?? 0,
        }
      : null,
    habitos: filtrarHabitosDeHoje(resposta.habitos || []),
    refeicoes: resposta.refeicoes || [],
    progresso: {
      concluidas: progresso.concluidas ?? 0,
      total: progresso.total ?? 0,
    },
    origem: {
      usuario: 'api',
      treino: 'api',
      habitos: 'api',
      refeicoes: 'api',
    },
    erroHabitos: null,
  }
}

async function carregarHomeLegada(signal) {
  try {
    const habitos = await api.get(
      'habitos/?ativo=true',
      opcoesDaRequisicao(signal),
    )

    return {
      ...homeMock,
      habitos: filtrarHabitosDeHoje(habitos),
      refeicoes: [],
      origem: {
        usuario: 'mock',
        treino: 'mock',
        habitos: 'api',
        refeicoes: 'indisponivel',
      },
      erroHabitos: null,
    }
  } catch (erro) {
    if (erro.name === 'AbortError') {
      throw erro
    }

    return {
      ...homeMock,
      habitos: [],
      refeicoes: [],
      origem: {
        usuario: 'mock',
        treino: 'mock',
        habitos: 'erro',
        refeicoes: 'indisponivel',
      },
      erroHabitos:
        'Não foi possível carregar os hábitos. Confira a API e o usuário de teste.',
    }
  }
}

async function carregarHome({ signal } = {}) {
  try {
    const resposta = await api.get('home/', opcoesDaRequisicao(signal))
    return normalizarHomeDaApi(resposta)
  } catch (erro) {
    if (erro.name === 'AbortError') {
      throw erro
    }

    if (erro instanceof ApiError && erro.status !== 404) {
      return carregarHomeLegada(signal)
    }

    return carregarHomeLegada(signal)
  }
}

export { carregarHome, filtrarHabitosDeHoje }
