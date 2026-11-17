import { useEffect, useState } from "react";
import { Link } from 'react-router';
import { listarHabitos } from "../../services/habitos";
import { DIAS_DA_SEMANA} from "../../constants/dias";

function PaginaHabitos() {
  const [habitos, setHabitos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  
  useEffect(() => {
    async function carregar() {
      try {
        setHabitos(await listarHabitos(true));
      } catch (falha) {
        console.error(falha);
        setErro("Houve uma falha ao carregar os hábitos.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [])

  const vazio = !carregando && !erro && habitos.length === 0

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/inicio" className="header-action" aria-label="Voltar">
          ←
        </Link>
        <h1>Hábitos</h1>
        <span />
      </header>

      <p className="helper-text">
        Cada hábito concluído vale 3 XP + 1 gema. Eles aparecem na Home só nos
        dias marcados.
      </p>

      {carregando && <p className="muted">Carregando…</p>}
      {erro && <p className="muted">{erro}</p>}

      {vazio && (
        <div className="card card--flat">
          <p className="muted">
            Você ainda não tem hábitos. Crie o primeiro e ele passa a aparecer
            nas suas missões diárias.
          </p>
        </div>
      )}

      {habitos.map((habito) => (
        <article className="card" key={habito.id}>
          <div className="cluster cluster--between">
            <h3>{habito.nome}</h3>
            <Link
              to={`/habitos/${habito.id}/editar`}
              className="btn btn-secondary"
            >
              Editar
            </Link>
          </div>

          {habito.descricao && (
            <p className="helper-text">{habito.descricao}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-3.5">
            {DIAS_DA_SEMANA.map((dia) => {
              const marcado = habito.dias_semana.includes(dia.codigo)

              return (
                <span
                  key={dia.codigo}
                  className={
                    marcado
                      ? 'chip'
                      : 'chip bg-[var(--color-surface-raised)] text-[var(--color-text-subtle)]'
                  }
                  title={dia.codigo}
                >
                  {dia.letra}
                </span>
              )
            })}
          </div>
        </article>
      ))}

      <Link to="/habitos/novo" className="btn btn-full">
        + Novo hábito
      </Link>
    </div>
  )
}

export default PaginaHabitos
