import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingLayout } from '@/components/layout/LandingLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { Homepage } from '@/pages/Homepage';
import { Dashboard } from '@/pages/Dashboard';
import { Analytics } from '@/pages/Analytics';
import { History } from '@/pages/History';
import { Settings } from '@/pages/Settings';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page with minimal layout */}
        <Route
          path="/"
          element={
            <LandingLayout>
              <Homepage />
            </LandingLayout>
          }
        />

        {/* App routes with full layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Redirect unknown routes to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
