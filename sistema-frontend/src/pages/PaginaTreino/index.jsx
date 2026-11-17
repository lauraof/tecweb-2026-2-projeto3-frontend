import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../../services/api";
import "./index.css";



function PaginaTreino() {
  const [treino, setTreino] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarTreino() {
      setCarregando(true);
      setErro("");

      try {
        const usuarioId = localStorage.getItem("usuario_id");

        if (!usuarioId) {
          setErro("Usuário não identificado.");
          return;
        }

        const resposta = await api.get("/api/missoes/hoje", {
          headers: {
            "X-Usuario-Id": usuarioId,
          },
        });

        setTreino(resposta.treino);
      } catch (error) {
        setErro("Não foi possível carregar o treino do dia.");
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }

    carregarTreino();
  }, []);

  const exercicios = treino?.exercicios ?? [];
  const total = treino?.total ?? 0;
  const quantidadeConcluida = treino?.concluidos ?? 0;

  const progresso =
    total > 0 ? (quantidadeConcluida / total) * 100 : 0;

  if (carregando) {
    return <main className="page">Carregando treino...</main>;
  }

  if (erro) {
    return <main className="page">{erro}</main>;
  }

  if (!treino) {
    return (
      <main className="page">
        <h1>Hoje é dia de descanso!</h1>
        <p>Você não possui exercícios programados para hoje.</p>
        <Link to="/treino/gerar" className="btn">
          Gerar treino
        </Link>
      </main>
    );
  }

  return (
    <main className="page pagina-treino">
      <header className="treino-cabecalho">
        <Link to="/inicio" className="treino-voltar">
          ←
        </Link>

        <div>
          <span className="treino-etiqueta">
            MISSÃO DIÁRIA
          </span>
          <h1>Treino do dia</h1>
        </div>
      </header>

      <section className="treino-resumo">
        <span className="treino-etiqueta">
          SEU TREINO
        </span>

        <h2>{treino.nome}</h2>

        <p>
          {total} exercícios programados para hoje
        </p>

        <div className="treino-progresso-info">
          <span>Progresso do treino</span>
          <strong>
            {quantidadeConcluida}/{total}
          </strong>
        </div>

        <div
          className="treino-progresso"
          role="progressbar"
          aria-valuenow={quantidadeConcluida}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          <div
            className="treino-progresso-barra"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </section>

      <section className="treino-lista">
        <h2>Exercícios</h2>

        {exercicios.map((exercicio) => {
          const concluido = exercicio.concluido;

          return (
            <label
              key={exercicio.id}
              className={`treino-exercicio ${
                concluido ? "concluido" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={concluido}
                disabled
                readOnly
              />

              <div className="treino-exercicio-info">
                <strong>{exercicio.nome}</strong>

                <span>
                  {exercicio.series} × {exercicio.repeticoes}
                  {" · "}
                  descanso {exercicio.descanso}s
                </span>
              </div>

              <div className="treino-recompensa">
                <span>+{treino.xp_por_item} XP</span>
                <span>+{treino.gemas_por_item} gemas</span>
              </div>
            </label>
          );
        })}
      </section>

      <div className="treino-aviso">
        <strong>Aviso</strong>
        <p>
          Este treino foi gerado por inteligência artificial
          e serve como orientação geral. Consulte um
          profissional antes de iniciar uma nova rotina.
        </p>
      </div>

      {total > 0 && quantidadeConcluida === total && (
        <div className="treino-finalizado">
          <strong>Treino concluído!</strong>
          <p>Você completou todos os exercícios de hoje.</p>
        </div>
      )}

      <Link
        to="/treino/gerar"
        className="btn treino-gerar"
      >
        Gerar novo treino
      </Link>

    </main>
  );
}

export default PaginaTreino;
