
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingLayout } from './presentation/layouts/LandingLayout.tsx';
import { AppLayout } from './presentation/layouts/AppLayout.tsx';
import { ProtectedRoute } from './presentation/components/ProtectedRoute.tsx';

// Pages
import LandingPage from './presentation/pages/LandingPage.tsx';
import Dashboard from './presentation/pages/Dashboard.tsx';
import Recordings from './presentation/pages/Recordings.tsx';
import HealthRecord from './presentation/pages/HealthRecord.tsx';
import Medications from './presentation/pages/Medications.tsx';
import Login from './presentation/pages/Login.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
        </Route>
        
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Application */}
        <Route path="/app" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="recordings" element={<Recordings />} />
            <Route path="records" element={<HealthRecord />} />
            <Route path="medications" element={<Medications />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
