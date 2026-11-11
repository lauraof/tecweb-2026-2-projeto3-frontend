import { Route, Routes } from 'react-router'

import ProtectedRoute from './ProtectedRoute.jsx'
import OpeningPage from '../pages/OpeningPage/OpeningPage.jsx'
import RegisterPage from '../pages/RegisterPage/RegisterPage.jsx'
import LoginPage from '../pages/LoginPage/LoginPage.jsx'
import OnboardingPage from '../pages/OnboardingPage/OnboardingPage.jsx'
import HomePage from '../pages/HomePage/HomePage.jsx'
import HabitsPage from '../pages/HabitsPage/HabitsPage.jsx'
import HabitFormPage from '../pages/HabitFormPage/HabitFormPage.jsx'
import DietPage from '../pages/DietPage/DietPage.jsx'
import GoalsPage from '../pages/GoalsPage/GoalsPage.jsx'
import WorkoutPage from '../pages/WorkoutPage/WorkoutPage.jsx'
import GenerateWorkoutPage from '../pages/GenerateWorkoutPage/GenerateWorkoutPage.jsx'
import ReviewWorkoutPage from '../pages/ReviewWorkoutPage/ReviewWorkoutPage.jsx'
import ProfilePage from '../pages/ProfilePage/ProfilePage.jsx'
import StorePage from '../pages/StorePage/StorePage.jsx'
import GroupsPage from '../pages/GroupsPage/GroupsPage.jsx'
import GroupFormPage from '../pages/GroupFormPage/GroupFormPage.jsx'
import GroupDetailsPage from '../pages/GroupDetailsPage/GroupDetailsPage.jsx'
import GlobalRankingPage from '../pages/GlobalRankingPage/GlobalRankingPage.jsx'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OpeningPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/habitos" element={<HabitsPage />} />
        <Route path="/habitos/novo" element={<HabitFormPage />} />
        <Route path="/habitos/:habitId/editar" element={<HabitFormPage />} />
        <Route path="/dieta" element={<DietPage />} />
        <Route path="/perfil/metas" element={<GoalsPage />} />
        <Route path="/treino" element={<WorkoutPage />} />
        <Route path="/treino/gerar" element={<GenerateWorkoutPage />} />
        <Route path="/treino/revisar" element={<ReviewWorkoutPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/loja" element={<StorePage />} />
        <Route path="/grupos" element={<GroupsPage />} />
        <Route path="/grupos/novo" element={<GroupFormPage />} />
        <Route path="/grupos/:groupId" element={<GroupDetailsPage />} />
        <Route path="/ranking" element={<GlobalRankingPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
