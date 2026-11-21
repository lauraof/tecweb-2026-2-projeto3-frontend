import { useNavigate } from 'react-router'
import { useState } from 'react'
import { gerarTreino, mensagemDoErro } from '../../services/treino'

const DIAS_DA_SEMANA = [
  { codigo: 'SEG', rotulo: 'Seg' },
  { codigo: 'TER', rotulo: 'Ter' },
  { codigo: 'QUA', rotulo: 'Qua' },
  { codigo: 'QUI', rotulo: 'Qui' },
  { codigo: 'SEX', rotulo: 'Sex' },
  { codigo: 'SAB', rotulo: 'Sáb' },
  { codigo: 'DOM', rotulo: 'Dom' },
]

const EQUIPAMENTOS = [
  { valor: 'academia', rotulo: 'Academia completa', descricao: 'Máquinas, barras e anilhas' },
  { valor: 'halteres', rotulo: 'Halteres ou elásticos', descricao: 'Equipamento básico em casa' },
  { valor: 'peso-corpo', rotulo: 'Peso do corpo', descricao: 'Sem nenhum equipamento' },
]

const DURACOES = [
  { valor: 20, rotulo: '20 min' },
  { valor: 40, rotulo: '40 min' },
  { valor: 60, rotulo: '60 min' },
]

const EXPERIENCIAS = [
  { valor: 'iniciante', rotulo: 'Iniciante' },
  { valor: 'intermediario', rotulo: 'Intermediário' },
  { valor: 'avancado', rotulo: 'Avançado' },
]

const OBJETIVOS = [
  { valor: 'ganhar massa muscular', rotulo: 'Ganhar massa' },
  { valor: 'perder peso', rotulo: 'Perder peso' },
  { valor: 'condicionamento geral', rotulo: 'Condicionamento' },
]

function validar(formulario) {
  if (!formulario.objetivo) return 'Escolha um objetivo.'
  if (formulario.dias.length === 0) return 'Escolha pelo menos um dia de treino.'
  if (!formulario.equipamento) return 'Escolha o equipamento disponível.'
  if (!formulario.duracao) return 'Escolha a duração do treino.'
  if (!formulario.experiencia) return 'Escolha seu nível de experiência.'
  return null
} 

function EscolhaUnica({ titulo, opcoes, valor, aoEscolher, horizontal = false }) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-text-subtle">
        {titulo}
      </legend>

      <div className={horizontal ? 'grid grid-cols-3 gap-2' : 'flex flex-col gap-2'}>
        {opcoes.map((opcao) => {
          const selecionado = valor === opcao.valor

          return (
            <button
              key={opcao.valor}
              type="button"
              aria-pressed={selecionado}
              onClick={() => aoEscolher(opcao.valor)}
              className={`rounded-md border px-4 py-3 transition ${
                horizontal ? 'text-center' : 'text-left'
              } ${
                selecionado
                  ? 'border-primary bg-primary-soft text-text'
                  : 'border-border bg-surface text-text-muted hover:bg-surface-raised'
              }`}
            >
              <span className="block text-sm font-bold">{opcao.rotulo}</span>
              {opcao.descricao && (
                <span className="mt-0.5 block text-xs text-text-subtle">{opcao.descricao}</span>
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function PaginaGerarTreino() {
  const navigate = useNavigate() 
  const [formulario, setFormulario] = useState({ 
    objetivo : "",
    dias: [],
    equipamento: "", 
    duracao: null, 
    experiencia: "", 
    observacoes: "", 

  })
  const [enviando, setEnviando] = useState(false) 
  const [erro, setErro] = useState(null)

  function alternarDia(codigo) {
    setFormulario((atual) => ({...atual, dias : atual.dias.includes(codigo) ? atual.dias.filter((dia) => dia !== codigo) : [...atual.dias, codigo],}))
  }

  function atualizar (campo, valor) {
    setFormulario((atual) => ({...atual, [campo] : valor}))
  }

  async function aoEnviar(evento) {
    evento.preventDefault()

    const problema = validar(formulario)

    if (problema) {
      setErro(problema)
      return
    }

    setErro(null)
    setEnviando(true)

    try {
      const plano = await gerarTreino(formulario)
      navigate('/treino/revisar', { state: { plano } })
    } catch (erroDaApi) {
      setErro(mensagemDoErro(erroDaApi))
    } finally {
      setEnviando(false)
    }
  }

  console.log(formulario)

  return (
    <main className="min-h-screen bg-bg pb-28">
      <header className="grid grid-cols-[52px_1fr_52px] items-center gap-3 min-h-[80px] bg-primary px-5 py-3">
        <button
          type="button"
          aria-label="Voltar"
          onClick={() => navigate('/treino')}
          className="grid h-11 w-11 place-items-center rounded-md border border-white/25 text-white hover:bg-white/10"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <h1 className="m-0 text-center text-base font-black uppercase tracking-widest text-white">
          Montar treino
        </h1>

        <span />
      </header>

      <form onSubmit={aoEnviar} className="flex flex-col gap-8 px-5 py-6">

        <EscolhaUnica horizontal titulo="objetivo" opcoes={OBJETIVOS} valor={formulario.objetivo}
          aoEscolher={(valor) => atualizar('objetivo', valor)}/>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-text-subtle">
            Dias de treino
          </legend>
          <div className="grid grid-cols-7 gap-1.5">
            {DIAS_DA_SEMANA.map((dia) => {
              const selecionado = formulario.dias.includes(dia.codigo)

              return (
                <button
                  key={dia.codigo}
                  type="button"
                  aria-pressed={selecionado}
                  onClick={() => alternarDia(dia.codigo)}
                  className={`h-12 rounded-md border text-xs font-bold uppercase transition ${
                    selecionado
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-surface text-text-muted hover:bg-surface-raised'
                  }`}
                >
                  {dia.rotulo}
                </button>
              )
            })}
          </div>
        </fieldset>
        <EscolhaUnica
          titulo="Equipamento disponível"
          opcoes={EQUIPAMENTOS}
          valor={formulario.equipamento}
          aoEscolher={(valor) => atualizar('equipamento', valor)}
        />

        <EscolhaUnica
          horizontal
          titulo="Duração do treino"
          opcoes={DURACOES}
          valor={formulario.duracao}
          aoEscolher={(valor) => atualizar('duracao', valor)}
        />

        <EscolhaUnica
          horizontal
          titulo="Experiência"
          opcoes={EXPERIENCIAS}
          valor={formulario.experiencia}
          aoEscolher={(valor) => atualizar('experiencia', valor)}
        />

        <div>
          <label
            htmlFor="observacoes"
            className="mb-3 block text-xs font-bold uppercase tracking-widest text-text-subtle"
          >
            Observações e restrições
          </label>

          <textarea
            id="observacoes"
            rows={4}
            maxLength={300}
            value={formulario.observacoes}
            onChange={(evento) => atualizar('observacoes', evento.target.value)}
            placeholder="Ex.: dor no ombro direito, prefiro treinos sem corrida"
            className="w-full resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-subtle focus:border-primary focus:outline-none"
          />

          <span className="mt-1 block text-right text-xs text-text-subtle">
            {formulario.observacoes.length}/300
          </span>
        </div>

        {erro && (
          <span className="block rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {erro}
          </span>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="mt-2 min-h-[50px] w-full rounded-md bg-primary font-black text-white shadow-button transition hover:bg-primary-hover active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enviando ? 'Gerando treino...' : 'Gerar treino'}
        </button>
      </form>
    </main>
  )
}

export default PaginaGerarTreino