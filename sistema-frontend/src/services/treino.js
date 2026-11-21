import api from './api.js'

const USUARIO_ID = import.meta.env.VITE_USUARIO_ID || '1'

const EQUIPAMENTOS_POR_ESCOLHA = {
  'academia': ['academia completa', 'barras', 'halteres', 'máquinas'],
  'halteres': ['halteres', 'elásticos'],
  'peso-corpo': ['peso do corpo'],
}

function montarPayload(formulario) {
  const payload = {
    usuario_id: Number(USUARIO_ID),
    objetivo: formulario.objetivo,
    experiencia: formulario.experiencia,
    frequencia_semanal: formulario.dias.length,
    duracao_minutos: formulario.duracao,
    equipamentos: EQUIPAMENTOS_POR_ESCOLHA[formulario.equipamento],
    dias_disponiveis: formulario.dias,
  }

  const observacoes = formulario.observacoes.trim()
  if (observacoes) {
    payload.observacoes = observacoes
  }

  return payload
}

function mensagemDoErro(erro) {
  const dados = erro.data

  if (dados?.erro) {
    return dados.erro
  }

  if (dados && typeof dados === 'object') {
    const primeiro = Object.values(dados)[0]
    if (Array.isArray(primeiro)) return primeiro[0]
  }

  return 'Não foi possível gerar o treino. Tente novamente.'
}

async function gerarTreino(formulario) {
  return api.post('treinos/gerar/', montarPayload(formulario))
}

export { gerarTreino, mensagemDoErro }