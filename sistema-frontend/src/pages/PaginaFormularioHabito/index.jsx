import { useEffect, useState } from "react";
import { DIAS_DA_SEMANA } from "../../constants/dias";
import { Link, useParams, useNavigate } from 'react-router';
import { atualizarHabito, criarHabito, obterHabito, pausarHabito } from "../../services/habitos";

function PaginaFormularioHabito() {
  const navigate = useNavigate();
  const { habitoId } = useParams();
  const editando = Boolean(habitoId);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dias, setDias] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(editando);

  useEffect(() => {
    if (!editando) {
      return 
    }
    async function carregar() {
      try {
        const habito = await obterHabito(habitoId);
        setNome(habito.nome);
        setDescricao(habito.descricao);
        setDias(habito.dias_semana);
      } catch (falha) {
        console.error(falha);
        setErro('Não foi possível carregar esse hábito');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [habitoId, editando]);

  function alternarDia(codigo) {
    const dias_alt = dias.includes(codigo) ? dias.filter((dia) => dia !== codigo) : [...dias, codigo];
    setDias(dias_alt);

  }

  const formularioValido = nome.trim() !== '' && dias.length > 0;

  async function onSubmit(evento) {
    evento.preventDefault();
    setSalvando(true);
    const dados = {nome, descricao, 'dias_semana': dias};
    try {
      if (editando) {
        await atualizarHabito(habitoId, dados);
      } else {
        await criarHabito(dados);
      }
      navigate('/habitos');
    } catch (falha) {
      console.error(falha);
      setErro("Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }

  }

  async function onPausar() {
  setSalvando(true)
  try {
    await pausarHabito(habitoId)
    navigate('/habitos')
  } catch (falha) {
    console.error(falha)
    setErro('Não foi possível pausar o hábito.')
  } finally {
    setSalvando(false)
  }
  }

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/habitos" className="header-action" aria-label="Voltar">
          ←
        </Link>
        <h1>{editando ? 'Editar hábito' : 'Novo hábito'}</h1>
        <span />
      </header>

      {erro && <p className="muted">{erro}</p>}

      {carregando ? (
        <p className="muted">Carregando…</p>
      ) : (
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="nome">Título</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              placeholder="Ex.: Ler 20 páginas"
              maxLength={100}
            />
          </div>

          <div className="field">
            <label htmlFor="descricao">Por que importa? (opcional)</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(evento) => setDescricao(evento.target.value)}
              placeholder="Por que esse hábito importa para você?"
            />
          </div>

          <div className="field">
            <span className="label">Dias da semana</span>

            <div className="flex flex-wrap gap-2">
              {DIAS_DA_SEMANA.map((dia) => {
                const marcado = dias.includes(dia.codigo)

                return (
                  <button
                    key={dia.codigo}
                    type="button"
                    onClick={() => alternarDia(dia.codigo)}
                    aria-pressed={marcado}
                    title={dia.codigo}
                    className={
                      marcado
                        ? 'chip cursor-pointer'
                        : 'chip cursor-pointer bg-[var(--color-surface-raised)] text-[var(--color-text-subtle)]'
                    }
                  >
                    {dia.letra}
                  </button>
                )
              })}
            </div>

            {dias.length === 0 && (
              <span className="helper-text">
                Escolha pelo menos um dia da semana.
              </span>
            )}
          </div>

          <div className="card card--flat">
            <span className="label">Recompensa</span>
            <p className="helper-text">
              <strong className="text-cyan">3 XP</strong> +{' '}
              <strong className="text-pink">1 gema</strong> por conclusão ·
              valor fixo do Sistema
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-full mt-6"
            disabled={!formularioValido || salvando}
          >
            {salvando ? 'Salvando…' : 'Salvar hábito'}
          </button>
          {editando && (
            <button
              type="button"
              className="btn btn-secondary btn-full mt-3"
              onClick={onPausar}
              disabled={salvando}
            >
              Pausar hábito
            </button>
          )}
        </form>
      )}
    </div>
  )};

export default PaginaFormularioHabito;
