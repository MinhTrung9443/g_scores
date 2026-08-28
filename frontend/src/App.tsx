import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import TopGroupAPage from './pages/TopGroupAPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="top-group-a" element={<TopGroupAPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
