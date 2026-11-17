import { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router'

import { carregarHome } from '../../services/home.js'

const formatadorData = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

function Icone({ nome, tamanho = 22 }) {
  const icones = {
    casa: (
      <>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10.5V20h13v-9.5M9 20v-6h6v6" />
      </>
    ),
    treino: (
      <>
        <path d="M6.5 8.5v7M17.5 8.5v7M3.5 10v4M20.5 10v4M6.5 12h11" />
        <path d="M3.5 12H2M22 12h-1.5" />
      </>
    ),
    dieta: (
      <>
        <path d="M5 11h14a7 7 0 0 1-14 0Z" />
        <path d="M8 8c0-2 1.5-3.5 3.5-4M12 8c0-2 1.5-3.5 3.5-4M4 20h16" />
      </>
    ),
    grupos: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 20v-2.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V20" />
        <path d="M15 14h1.5a4 4 0 0 1 4 4v2" />
      </>
    ),
    perfil: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20v-2.5a6.5 6.5 0 0 1 13 0V20" />
      </>
    ),
    gema: <path d="m12 3 7 5-7 13L5 8l7-5Zm-7 5h14M9 8l3 13 3-13M9 8l3-5 3 5" />,
    chama: <path d="M13.5 3.5c.5 3-1.5 4-1.5 6.5 0 1.2.8 2 1.8 2 1.7 0 2.7-2 2.2-4 2 1.7 3.5 4.2 3.5 6.8A7.5 7.5 0 1 1 7 9.2c-.3 2.3.8 3.8 2.2 3.8 1.3 0 2.1-1.1 1.8-2.5-.5-2.5.2-5.2 2.5-7Z" />,
    raio: <path d="m13 2-8 12h6l-1 8 9-13h-6V2Z" />,
    seta: <path d="m9 18 6-6-6-6" />,
    atualizar: <path d="M20 7v5h-5M4 17v-5h5M6.1 8A7 7 0 0 1 18.5 6M17.9 16A7 7 0 0 1 5.5 18" />,
  }

  return (
    <svg
      aria-hidden="true"
      className="home-icon"
      fill="none"
      height={tamanho}
      viewBox="0 0 24 24"
      width={tamanho}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        {icones[nome]}
      </g>
    </svg>
  )
}

function SeloDemo() {
  return <span className="home-demo-badge">demo</span>
}

function Esqueleto() {
  return (
    <div aria-label="Carregando missões" className="home-loading" role="status">
      <div className="home-skeleton home-skeleton--profile" />
      <div className="home-stats-grid">
        <div className="home-skeleton home-skeleton--stat" />
        <div className="home-skeleton home-skeleton--stat" />
        <div className="home-skeleton home-skeleton--stat" />
      </div>
      <div className="home-skeleton home-skeleton--panel" />
      <span className="sr-only">Carregando...</span>
    </div>
  )
}

function EstadoVazio({ children }) {
  return (
    <div className="home-empty">
      <span aria-hidden="true" className="home-empty__symbol">—</span>
      <p>{children}</p>
    </div>
  )
}

function PaginaInicial() {
  const [home, setHome] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [tentativa, setTentativa] = useState(0)
  const [dataDaPagina] = useState(() => new Date())

  const recarregar = useCallback(() => {
    setCarregando(true)
    setTentativa((valor) => valor + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function buscarHome() {
      try {
        const dados = await carregarHome({ signal: controller.signal })
        setHome(dados)
      } catch (erro) {
        if (erro.name !== 'AbortError') {
          setHome(null)
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false)
        }
      }
    }

    buscarHome()
    return () => controller.abort()
  }, [tentativa])

  const dataHoje = formatadorData.format(dataDaPagina)
  const usuario = home?.usuario
  const treino = home?.treino
  const progresso = home?.progresso
  const percentualNivel = usuario?.xpParaProximoNivel
    ? Math.min(100, Math.round((usuario.xpNoNivel / usuario.xpParaProximoNivel) * 100))
    : 0
  const percentualDia = progresso?.total
    ? Math.min(100, Math.round((progresso.concluidas / progresso.total) * 100))
    : 0

  return (
    <main className="home-page">
      <header className="home-header">
        <span aria-hidden="true" className="home-brand">s</span>
        <h1>Missões</h1>
        <div aria-label="Gemas" className="home-wallet">
          <Icone nome="gema" tamanho={19} />
          <strong>{usuario?.gemas ?? '—'}</strong>
        </div>
      </header>

      <div className="home-content">
        {carregando && !home ? (
          <Esqueleto />
        ) : home ? (
          <>
            <section className="home-profile" aria-labelledby="saudacao-home">
              <div aria-hidden="true" className="home-avatar">C</div>
              <div>
                <div className="home-title-line">
                  <h2 id="saudacao-home">Olá, {usuario.nome}</h2>
                  {home.origem.usuario === 'mock' && <SeloDemo />}
                </div>
                <p>{dataHoje}</p>
              </div>
            </section>

            <section aria-label="Resumo do usuário" className="home-stats-grid">
              <article className="home-stat-card">
                <span>Nível</span>
                <strong>{usuario.nivel}</strong>
                <div className="home-mini-progress"><i style={{ width: `${percentualNivel}%` }} /></div>
              </article>
              <article className="home-stat-card">
                <span>Streak</span>
                <strong>{usuario.streak}<small> dias</small></strong>
                <Icone nome="chama" tamanho={20} />
              </article>
              <article className="home-stat-card home-stat-card--gems">
                <span>Gemas</span>
                <strong>{usuario.gemas}</strong>
                <Icone nome="gema" tamanho={20} />
              </article>
            </section>

            <section className="home-progress-card" aria-label="Progresso de hoje">
              <div className="home-card-heading">
                <div>
                  <span>Progresso de hoje</span>
                  <strong>{progresso.concluidas}<small> / {progresso.total}</small></strong>
                </div>
                <div className="home-progress-copy">
                  {home.origem.usuario === 'mock' && <SeloDemo />}
                  <p>Faltam <strong>{Math.max(0, progresso.total - progresso.concluidas)}</strong> para fechar o dia</p>
                </div>
              </div>
              <div
                aria-label={`${percentualDia}% concluído`}
                aria-valuemax="100"
                aria-valuemin="0"
                aria-valuenow={percentualDia}
                className="home-progress-track"
                role="progressbar"
              >
                <i style={{ width: `${percentualDia}%` }} />
              </div>
            </section>

            <section className="home-missions" aria-labelledby="titulo-missoes">
              <h2 className="home-section-title" id="titulo-missoes">Missões de hoje</h2>

              <div className="home-category-heading">
                <h3>Hábitos</h3>
                <span className="home-source home-source--api">api</span>
              </div>

              {home.erroHabitos ? (
                <div className="home-inline-error" role="alert">
                  <p>{home.erroHabitos}</p>
                  <button className="home-retry" onClick={recarregar} type="button">
                    <Icone nome="atualizar" tamanho={17} /> Tentar novamente
                  </button>
                </div>
              ) : home.habitos.length ? (
                <div className="home-habit-list">
                  {home.habitos.map((habito) => (
                    <article className="home-habit-card" key={habito.id}>
                      <div aria-hidden="true" className="home-habit-check">✓</div>
                      <div>
                        <h4>{habito.nome}</h4>
                        <p>{habito.descricao}</p>
                        <span className="home-reward"><Icone nome="raio" tamanho={16} /> +{habito.recompensaXp} XP</span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EstadoVazio>Nenhum hábito programado para hoje.</EstadoVazio>
              )}

              <div className="home-category-heading home-category-heading--spaced">
                <h3>Treino</h3>
                {home.origem.treino === 'mock' && <SeloDemo />}
              </div>

              {treino ? (
                <article className="home-workout-card">
                  <div className="home-workout-main">
                    <div>
                      <span className="home-workout-tag">{treino.nome}</span>
                      <h3>{treino.titulo}</h3>
                      <p>{treino.quantidadeExercicios} exercícios · ~{treino.duracaoMinutos} min</p>
                    </div>
                    <div aria-hidden="true" className="home-workout-orb"><Icone nome="treino" tamanho={52} /></div>
                  </div>
                  <div className="home-workout-footer">
                    <span className="home-reward"><Icone nome="raio" tamanho={16} /> +{treino.recompensaXp} <Icone nome="gema" tamanho={16} /> +{treino.recompensaGemas}</span>
                    <strong>{treino.exerciciosConcluidos}/{treino.quantidadeExercicios}</strong>
                    <NavLink aria-label="Abrir treino" className="home-next" to="/treino"><Icone nome="seta" /></NavLink>
                  </div>
                </article>
              ) : (
                <EstadoVazio>Nenhum treino programado para hoje.</EstadoVazio>
              )}

              <div className="home-category-heading home-category-heading--spaced">
                <h3>Refeições</h3>
                <span className="home-source">aguardando api</span>
              </div>
              <EstadoVazio>As refeições aparecerão quando o endpoint da Home estiver disponível.</EstadoVazio>
            </section>
          </>
        ) : (
          <section className="home-fatal-error" role="alert">
            <h2>Não foi possível abrir a Home</h2>
            <p>Tente carregar a página novamente.</p>
            <button className="btn" onClick={recarregar} type="button">Tentar novamente</button>
          </section>
        )}
      </div>

      <nav aria-label="Navegação principal" className="home-bottom-nav">
        <NavLink to="/inicio"><Icone nome="casa" /><span>Home</span></NavLink>
        <NavLink to="/treino"><Icone nome="treino" /><span>Treino</span></NavLink>
        <NavLink to="/dieta"><Icone nome="dieta" /><span>Dieta</span></NavLink>
        <NavLink to="/grupos"><Icone nome="grupos" /><span>Grupos</span></NavLink>
        <NavLink to="/perfil"><Icone nome="perfil" /><span>Perfil</span></NavLink>
      </nav>
    </main>
  )
}

export default PaginaInicial
