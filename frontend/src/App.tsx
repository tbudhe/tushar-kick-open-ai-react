import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import SystemPage from './components/pages/System';
import AI from './components/pages/Ai';
import PracticeML from './components/pages/PracticeMl';
import ContactPage from './components/pages/ContactPage';
import TechnicalProfile from './components/pages/TechnicalProfile';
import MainLayout from './components/layout/MainLayout';
import { appRoutes, legacyRedirectRoutes } from './constants/routes';
import './css/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
          <Routes>
            <Route path={appRoutes.home} element={<Home />} />
            <Route path={appRoutes.contact} element={<ContactPage />} />
            <Route path={appRoutes.technicalProfile} element={<TechnicalProfile />} />
            <Route path={legacyRedirectRoutes.root} element={<Navigate replace to={appRoutes.home} />} />
            <Route path={legacyRedirectRoutes.userHub} element={<Navigate replace to={appRoutes.contact} />} />
            <Route path={legacyRedirectRoutes.profile} element={<Navigate replace to={appRoutes.technicalProfile} />} />
            <Route path={legacyRedirectRoutes.contactLegacy} element={<Navigate replace to={appRoutes.contact} />} />
            <Route path={legacyRedirectRoutes.aiStudio} element={<Navigate replace to={appRoutes.aiStudio} />} />
            <Route path={legacyRedirectRoutes.systemDesign} element={<Navigate replace to={appRoutes.systemDesign} />} />
            <Route path={legacyRedirectRoutes.mlPlaybooks} element={<Navigate replace to={appRoutes.mlPlaybooks} />} />
            <Route path={appRoutes.systemDesign} element={<SystemPage />} />
            <Route path={appRoutes.aiStudio} element={<AI />} />
            <Route path={appRoutes.mlPlaybooks} element={<PracticeML />} />
            {/* Career Hub temporarily disabled */}
            {/* <Route path="/job-search" element={<JobSearch />} /> */}
            {/* <Route path="/applications" element={<ApplicationsPage />} /> */}
          </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;

