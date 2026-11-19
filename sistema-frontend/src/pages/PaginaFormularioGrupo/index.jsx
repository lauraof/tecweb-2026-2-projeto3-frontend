
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../../services/api";
import "./index.css";

const OBJETIVOS = [
  {
    codigo: "EXERCICIO",
    nome: "Treino",
    descricao: "Ganhe pontos concluindo exercícios.",
    icone: "⚔",
  },
  {
    codigo: "HABITO",
    nome: "Hábitos",
    descricao: "Ganhe pontos cumprindo hábitos diários.",
    icone: "✦",
  },
  {
    codigo: "REFEICAO",
    nome: "Alimentação",
    descricao: "Ganhe pontos concluindo refeições.",
    icone: "◈",
  },
];

function PaginaFormularioGrupo() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [duracao, setDuracao] = useState(30);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function alternarObjetivo(codigo) {
    setObjetivos((anteriores) =>
      anteriores.includes(codigo)
        ? anteriores.filter((item) => item !== codigo)
        : [...anteriores, codigo]
    );
  }

  async function criarGrupo(event) {
    event.preventDefault();
    setErro("");

    const nomeLimpo = nome.trim();

    if (!nomeLimpo) {
      setErro("Informe o nome do grupo.");
      return;
    }

    if (objetivos.length === 0) {
      setErro("Selecione pelo menos um objetivo.");
      return;
    }

    if (duracao < 1 || duracao > 365) {
      setErro("A duração deve estar entre 1 e 365 dias.");
      return;
    }

    const usuarioId = localStorage.getItem("usuario_id");

    if (!usuarioId) {
      setErro("Usuário não identificado. Entre na sua conta.");
      return;
    }

    setSalvando(true);

    try {
      const grupo = await api.post(
        "/api/grupos/",
        {
          nome: nomeLimpo,
          objetivos,
          duracao_dias: Number(duracao),
        },
        {
          headers: {
            "X-Usuario-Id": usuarioId,
          },
        }
      );

      navigate(`/grupos/${grupo.id}`);
    } catch (error) {
      console.error(error);

      setErro(
        error.data?.nome?.[0] ||
        error.data?.objetivos?.[0] ||
        error.data?.duracao_dias?.[0] ||
        "Não foi possível criar o grupo."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="page pagina-criar-grupo">
      <header className="criar-grupo-cabecalho">
        <Link
          to="/grupos"
          className="criar-grupo-voltar"
          aria-label="Voltar para grupos"
        >
          ←
        </Link>

        <div>
          <span className="criar-grupo-etiqueta">
            NOVO DESAFIO
          </span>
          <h1>Criar grupo</h1>
        </div>
      </header>

      <section className="criar-grupo-introducao">
        <span className="criar-grupo-etiqueta">
          REÚNA SUA EQUIPE
        </span>

        <h2>Todo progresso fica melhor em equipe.</h2>

        <p>
          Escolha os objetivos do desafio e dispute
          posições no leaderboard com seus amigos.
        </p>
      </section>

      <form
        onSubmit={criarGrupo}
        className="criar-grupo-formulario"
      >
        <div className="criar-grupo-campo">
          <label htmlFor="nome-grupo">
            Nome do grupo
          </label>

          <input
            id="nome-grupo"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Ex.: Desafio dos Monarcas"
            maxLength={100}
            required
          />

          <span className="criar-grupo-ajuda">
            Escolha um nome para identificar seu desafio.
          </span>
        </div>

        <fieldset className="criar-grupo-objetivos">
          <legend>
            Objetivos do desafio
          </legend>

          <p>
            Selecione as atividades que contarão pontos
            no ranking do grupo.
          </p>

          <div className="criar-grupo-opcoes">
            {OBJETIVOS.map((objetivo) => {
              const selecionado = objetivos.includes(
                objetivo.codigo
              );

              return (
                <label
                  key={objetivo.codigo}
                  className={`criar-grupo-opcao ${
                    selecionado ? "selecionado" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selecionado}
                    onChange={() =>
                      alternarObjetivo(objetivo.codigo)
                    }
                  />

                  <span className="criar-grupo-icone">
                    {objetivo.icone}
                  </span>

                  <span className="criar-grupo-opcao-info">
                    <strong>{objetivo.nome}</strong>
                    <small>{objetivo.descricao}</small>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="criar-grupo-campo">
          <label htmlFor="duracao-grupo">
            Duração do desafio
          </label>

          <select
            id="duracao-grupo"
            value={duracao}
            onChange={(event) =>
              setDuracao(Number(event.target.value))
            }
          >
            <option value={7}>7 dias</option>
            <option value={14}>14 dias</option>
            <option value={30}>30 dias</option>
            <option value={60}>60 dias</option>
            <option value={90}>90 dias</option>
          </select>

          <span className="criar-grupo-ajuda">
            O ranking considera apenas o XP conquistado
            durante o período do desafio.
          </span>
        </div>

        <div className="criar-grupo-resumo">
          <span className="criar-grupo-etiqueta">
            RESUMO DO DESAFIO
          </span>

          <div>
            <span>Objetivos selecionados</span>
            <strong>{objetivos.length}</strong>
          </div>

          <div>
            <span>Duração</span>
            <strong>{duracao} dias</strong>
          </div>

          <div>
            <span>Participantes iniciais</span>
            <strong>1</strong>
          </div>
        </div>

        {erro && (
          <div className="criar-grupo-erro" role="alert">
            {erro}
          </div>
        )}

        <button
          type="submit"
          className="btn criar-grupo-enviar"
          disabled={salvando}
        >
          {salvando
            ? "Criando grupo..."
            : "Criar desafio"}
        </button>

        <Link
          to="/grupos"
          className="btn btn-secondary criar-grupo-cancelar"
        >
          Cancelar
        </Link>
      </form>
    </main>
  );
}

export default PaginaFormularioGrupo;
