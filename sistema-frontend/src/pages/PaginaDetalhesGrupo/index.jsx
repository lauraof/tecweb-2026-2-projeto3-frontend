
import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import api from "../../services/api";
import "./index.css";

const NOMES_OBJETIVOS = {
  EXERCICIO: "Treino",
  HABITO: "Hábitos",
  REFEICAO: "Alimentação",
};

const MEDALHAS = ["🥇", "🥈", "🥉"];

function PaginaDetalhesGrupo() {
  const { grupoId } = useParams();
  const navigate = useNavigate();

  const [grupo, setGrupo] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroAcao, setErroAcao] = useState("");
  const [usuarioNovo, setUsuarioNovo] = useState("");
  const [salvando, setSalvando] = useState(false);

  const usuarioId = localStorage.getItem("usuario_id");

  const headers = {
    "X-Usuario-Id": usuarioId,
  };

  const carregarDados = useCallback(async () => {
    if (!usuarioId) {
      setErro("Usuário não identificado. Entre na sua conta.");
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const [dadosGrupo, dadosRanking] = await Promise.all([
        api.get(`/api/grupos/${grupoId}/`, { headers }),
        api.get(`/api/grupos/${grupoId}/leaderboard/`, {
          headers,
        }),
      ]);

      setGrupo(dadosGrupo);
      setLeaderboard(dadosRanking);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os dados do grupo.");
    } finally {
      setCarregando(false);
    }
  }, [grupoId, usuarioId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const ehCriador =
    grupo && String(grupo.criador.id) === String(usuarioId);

  async function adicionarMembro(event) {
    event.preventDefault();
    setErroAcao("");

    const id = Number(usuarioNovo);

    if (!Number.isInteger(id) || id <= 0) {
      setErroAcao("Informe um ID de usuário válido.");
      return;
    }

    setSalvando(true);

    try {
      await api.post(
        `/api/grupos/${grupoId}/membros/`,
        { usuario_id: id },
        { headers }
      );

      setUsuarioNovo("");
      await carregarDados();
    } catch (error) {
      console.error(error);
      setErroAcao(
        error.data?.erro ||
        "Não foi possível adicionar o participante."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function removerMembro(id) {
    const confirmou = window.confirm(
      "Deseja remover este participante do grupo?"
    );

    if (!confirmou) return;

    setErroAcao("");
    setSalvando(true);

    try {
      await api.delete(
        `/api/grupos/${grupoId}/membros/${id}/`,
        { headers }
      );

      await carregarDados();
    } catch (error) {
      console.error(error);
      setErroAcao("Não foi possível remover o participante.");
    } finally {
      setSalvando(false);
    }
  }

  async function sairGrupo() {
    const confirmou = window.confirm(
      "Deseja realmente sair deste grupo?"
    );

    if (!confirmou) return;

    setErroAcao("");
    setSalvando(true);

    try {
      await api.delete(
        `/api/grupos/${grupoId}/participacao/`,
        { headers }
      );

      navigate("/grupos");
    } catch (error) {
      console.error(error);
      setErroAcao("Não foi possível sair do grupo.");
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className="page detalhes-grupo">
        <p>Carregando grupo e leaderboard...</p>
      </main>
    );
  }

  if (erro || !grupo || !leaderboard) {
    return (
      <main className="page detalhes-grupo">
        <h1>Não foi possível abrir o grupo</h1>
        <p>{erro || "Grupo não encontrado."}</p>
        <Link to="/grupos" className="btn">
          Voltar para grupos
        </Link>
      </main>
    );
  }

  const ranking = leaderboard.ranking ?? [];
  const membros = grupo.membros ?? [];

  return (
    <main className="page detalhes-grupo">
      <header className="detalhes-grupo-cabecalho">
        <Link
          to="/grupos"
          className="detalhes-grupo-voltar"
          aria-label="Voltar para grupos"
        >
          ←
        </Link>

        <div>
          <span className="detalhes-grupo-etiqueta">
            DESAFIO COLETIVO
          </span>
          <h1>{grupo.nome}</h1>
        </div>
      </header>

      <section className="detalhes-grupo-resumo">
        <div className="detalhes-grupo-resumo-topo">
          <span className="detalhes-grupo-etiqueta">
            GRUPO #{grupo.id}
          </span>

          <span
            className={`detalhes-grupo-status ${
              leaderboard.encerrado ? "encerrado" : ""
            }`}
          >
            {leaderboard.encerrado
              ? "Encerrado"
              : "Em andamento"}
          </span>
        </div>

        <h2>{grupo.nome}</h2>

        <div className="detalhes-grupo-objetivos">
          {grupo.objetivos.map((objetivo) => (
            <span
              key={objetivo}
              className="detalhes-grupo-objetivo"
            >
              {NOMES_OBJETIVOS[objetivo] ?? objetivo}
            </span>
          ))}
        </div>

        <div className="detalhes-grupo-estatisticas">
          <div>
            <strong>{grupo.total_membros}</strong>
            <span>Participantes</span>
          </div>

          <div>
            <strong>{grupo.duracao_dias}</strong>
            <span>Dias de desafio</span>
          </div>
        </div>
      </section>

      <section className="detalhes-grupo-ranking">
        <div className="detalhes-grupo-titulo">
          <span className="detalhes-grupo-etiqueta">
            CLASSIFICAÇÃO
          </span>
          <h2>Leaderboard</h2>
          <p>
            Pontuação baseada no XP conquistado
            nos objetivos deste desafio.
          </p>
        </div>

        {ranking.length === 0 ? (
          <div className="detalhes-grupo-vazio">
            <p>Nenhum participante no ranking.</p>
          </div>
        ) : (
          <div className="detalhes-grupo-ranking-lista">
            {ranking.map((participante) => {
              const destaque =
                String(participante.usuario_id) ===
                String(usuarioId);

              return (
                <div
                  key={participante.usuario_id}
                  className={`detalhes-grupo-ranking-item ${
                    destaque ? "meu-ranking" : ""
                  }`}
                >
                  <span className="detalhes-grupo-posicao">
                    {participante.posicao <= 3
                      ? MEDALHAS[participante.posicao - 1]
                      : `#${participante.posicao}`}
                  </span>

                  <div className="detalhes-grupo-participante">
                    <strong>{participante.nome}</strong>

                    {destaque && (
                      <span>Você</span>
                    )}
                  </div>

                  <div className="detalhes-grupo-pontos">
                    <strong>{participante.xp}</strong>
                    <span>XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="detalhes-grupo-membros">
        <div className="detalhes-grupo-titulo">
          <span className="detalhes-grupo-etiqueta">
            EQUIPE
          </span>
          <h2>Participantes</h2>
        </div>

        <div className="detalhes-grupo-membros-lista">
          {membros.map((membro) => (
            <div
              key={membro.id}
              className="detalhes-grupo-membro"
            >
              <div className="detalhes-grupo-avatar">
                {membro.nome.charAt(0).toUpperCase()}
              </div>

              <div className="detalhes-grupo-membro-info">
                <strong>{membro.nome}</strong>
                <span>
                  {membro.id === grupo.criador.id
                    ? "Criador do grupo"
                    : "Participante"}
                </span>
              </div>

              {ehCriador &&
                membro.id !== grupo.criador.id && (
                  <button
                    type="button"
                    className="detalhes-grupo-remover"
                    onClick={() => removerMembro(membro.id)}
                    disabled={salvando}
                  >
                    Remover
                  </button>
                )}
            </div>
          ))}
        </div>
      </section>

      {ehCriador && (
        <section className="detalhes-grupo-adicionar">
          <span className="detalhes-grupo-etiqueta">
            CONVIDAR PARTICIPANTE
          </span>

          <h2>Adicionar membro</h2>

          <p>
            Informe o ID do usuário que deseja
            adicionar ao desafio.
          </p>

          <form onSubmit={adicionarMembro}>
            <input
              type="number"
              min="1"
              value={usuarioNovo}
              onChange={(event) =>
                setUsuarioNovo(event.target.value)
              }
              placeholder="ID do usuário"
              required
            />

            <button
              type="submit"
              className="btn"
              disabled={salvando}
            >
              {salvando
                ? "Adicionando..."
                : "Adicionar"}
            </button>
          </form>
        </section>
      )}

      {!ehCriador && (
        <button
          type="button"
          className="btn btn-secondary detalhes-grupo-sair"
          onClick={sairGrupo}
          disabled={salvando}
        >
          Sair do grupo
        </button>
      )}

      {erroAcao && (
        <div className="detalhes-grupo-erro" role="alert">
          {erroAcao}
        </div>
      )}
    </main>
  );
}

export default PaginaDetalhesGrupo;
