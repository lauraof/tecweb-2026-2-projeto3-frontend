
import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../../services/api";
import "./index.css";

const NOMES_OBJETIVOS = {
  EXERCICIO: "Treino",
  HABITO: "Hábitos",
  REFEICAO: "Alimentação",
};

function PaginaGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarGrupos() {
      setCarregando(true);
      setErro("");

      try {
        const usuarioId = localStorage.getItem("usuario_id");

        if (!usuarioId) {
          throw new Error("Usuário não identificado.");
        }

        const resposta = await api.get("/api/grupos/", {
          headers: {
            "X-Usuario-Id": usuarioId,
          },
        });

        if (ativo) {
          setGrupos(resposta);
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error.message === "Usuário não identificado."
              ? error.message
              : "Não foi possível carregar seus grupos."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarGrupos();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main className="page pagina-grupos">
      <header className="grupos-cabecalho">
        <Link
          to="/inicio"
          className="grupos-voltar"
          aria-label="Voltar para início"
        >
          ←
        </Link>

        <div>
          <span className="grupos-etiqueta">
            DESAFIOS COLETIVOS
          </span>
          <h1>Meus grupos</h1>
        </div>
      </header>

      <section className="grupos-introducao">
        <span className="grupos-etiqueta">
          EVOLUAM JUNTOS
        </span>

        <h2>Transforme evolução em competição.</h2>

        <p>
          Crie desafios com seus amigos, acumule XP
          e dispute posições no leaderboard.
        </p>

        <Link
          to="/grupos/novo"
          className="btn grupos-criar"
        >
          + Criar novo grupo
        </Link>
      </section>

      <section className="grupos-listagem">
        <div className="grupos-listagem-titulo">
          <h2>Seus desafios</h2>

          {!carregando && !erro && (
            <span className="grupos-contador">
              {grupos.length}
            </span>
          )}
        </div>

        {carregando && (
          <div className="grupos-estado">
            <p>Carregando seus grupos...</p>
          </div>
        )}

        {erro && (
          <div className="grupos-estado grupos-erro">
            <strong>Não foi possível carregar.</strong>
            <p>{erro}</p>
          </div>
        )}

        {!carregando && !erro && grupos.length === 0 && (
          <div className="grupos-estado">
            <span className="grupos-icone-vazio">♛</span>

            <h3>Nenhum grupo ainda</h3>

            <p>
              Crie seu primeiro desafio e convide
              seus amigos para evoluírem juntos.
            </p>

            <Link
              to="/grupos/novo"
              className="btn"
            >
              Criar meu primeiro grupo
            </Link>
          </div>
        )}

        {!carregando && !erro && grupos.length > 0 && (
          <div className="grupos-cards">
            {grupos.map((grupo) => (
              <Link
                key={grupo.id}
                to={`/grupos/${grupo.id}`}
                className="grupo-card"
              >
                <div className="grupo-card-topo">
                  <span className="grupos-etiqueta">
                    DESAFIO #{grupo.id}
                  </span>

                  <span className="grupo-card-seta">
                    ↗
                  </span>
                </div>

                <h3>{grupo.nome}</h3>

                <div className="grupo-card-objetivos">
                  {grupo.objetivos.map((objetivo) => (
                    <span
                      key={objetivo}
                      className="grupo-objetivo"
                    >
                      {NOMES_OBJETIVOS[objetivo] ??
                        objetivo}
                    </span>
                  ))}
                </div>

                <div className="grupo-card-rodape">
                  <span>
                    ◉ {grupo.total_membros} participantes
                  </span>

                  <span>
                    ◷ {grupo.duracao_dias} dias
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default PaginaGrupos;
