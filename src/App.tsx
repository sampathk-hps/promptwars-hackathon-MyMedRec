
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingLayout } from './presentation/layouts/LandingLayout.tsx';
import { AppLayout } from './presentation/layouts/AppLayout.tsx';

// Pages
import LandingPage from './presentation/pages/LandingPage.tsx';
import Dashboard from './presentation/pages/Dashboard.tsx';
import Recordings from './presentation/pages/Recordings.tsx';
import HealthRecord from './presentation/pages/HealthRecord.tsx';
import Medications from './presentation/pages/Medications.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        {/* Application */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="recordings" element={<Recordings />} />
          <Route path="records" element={<HealthRecord />} />
          <Route path="medications" element={<Medications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
