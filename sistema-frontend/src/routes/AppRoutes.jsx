import { Route, Routes } from 'react-router'

import ProtectedRoute from './ProtectedRoute.jsx'
import PaginaAbertura from '../pages/PaginaAbertura/index.jsx'
import PaginaCadastro from '../pages/PaginaCadastro/index.jsx'
import PaginaEntrar from '../pages/PaginaEntrar/index.jsx'
import PaginaIntroducao from '../pages/PaginaIntroducao/index.jsx'
import PaginaInicial from '../pages/PaginaInicial/index.jsx'
import PaginaHabitos from '../pages/PaginaHabitos/index.jsx'
import PaginaFormularioHabito from '../pages/PaginaFormularioHabito/index.jsx'
import PaginaDieta from '../pages/PaginaDieta/index.jsx'
import PaginaMetas from '../pages/PaginaMetas/index.jsx'
import PaginaTreino from '../pages/PaginaTreino/index.jsx'
import PaginaGerarTreino from '../pages/PaginaGerarTreino/index.jsx'
import PaginaRevisarTreino from '../pages/PaginaRevisarTreino/index.jsx'
import PaginaPerfil from '../pages/PaginaPerfil/index.jsx'
import PaginaLoja from '../pages/PaginaLoja/index.jsx'
import PaginaGrupos from '../pages/PaginaGrupos/index.jsx'
import PaginaFormularioGrupo from '../pages/PaginaFormularioGrupo/index.jsx'
import PaginaDetalhesGrupo from '../pages/PaginaDetalhesGrupo/index.jsx'
import PaginaRankingGlobal from '../pages/PaginaRankingGlobal/index.jsx'
import PaginaNaoEncontrada from '../pages/PaginaNaoEncontrada/index.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PaginaAbertura />} />
      <Route path="/cadastro" element={<PaginaCadastro />} />
      <Route path="/login" element={<PaginaEntrar />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<PaginaIntroducao />} />
        <Route path="/inicio" element={<PaginaInicial />} />
        <Route path="/habitos" element={<PaginaHabitos />} />
        <Route path="/habitos/novo" element={<PaginaFormularioHabito />} />
        <Route path="/habitos/:habitoId/editar" element={<PaginaFormularioHabito />} />
        <Route path="/dieta" element={<PaginaDieta />} />
        <Route path="/perfil/metas" element={<PaginaMetas />} />
        <Route path="/treino" element={<PaginaTreino />} />
        <Route path="/treino/gerar" element={<PaginaGerarTreino />} />
        <Route path="/treino/revisar" element={<PaginaRevisarTreino />} />
        <Route path="/perfil" element={<PaginaPerfil />} />
        <Route path="/loja" element={<PaginaLoja />} />
        <Route path="/grupos" element={<PaginaGrupos />} />
        <Route path="/grupos/novo" element={<PaginaFormularioGrupo />} />
        <Route path="/grupos/:grupoId" element={<PaginaDetalhesGrupo />} />
        <Route path="/ranking" element={<PaginaRankingGlobal />} />
      </Route>

      <Route path="*" element={<PaginaNaoEncontrada />} />
    </Routes>
  )
}

export default AppRoutes
