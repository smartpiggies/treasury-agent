import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingLayout } from '@/components/layout/LandingLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { Homepage } from '@/pages/Homepage';
import { Dashboard } from '@/pages/Dashboard';
import { Analytics } from '@/pages/Analytics';
import { History } from '@/pages/History';
import { Settings } from '@/pages/Settings';
import { DocsOverview } from '@/pages/docs/DocsOverview';
import { GettingStarted } from '@/pages/docs/GettingStarted';
import { Architecture } from '@/pages/docs/Architecture';
import { CircleGateway } from '@/pages/docs/CircleGateway';
import { UniswapIntegration } from '@/pages/docs/UniswapIntegration';
import { LifiIntegration } from '@/pages/docs/LifiIntegration';
import { EnsIntegration } from '@/pages/docs/EnsIntegration';
import { DiscordCommands } from '@/pages/docs/DiscordCommands';
import { Approvals } from '@/pages/docs/Approvals';
import { DashboardGuide } from '@/pages/docs/DashboardGuide';
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

        {/* Docs routes with docs layout */}
        <Route element={<DocsLayout />}>
          <Route path="/docs" element={<DocsOverview />} />
          <Route path="/docs/getting-started" element={<GettingStarted />} />
          <Route path="/docs/architecture" element={<Architecture />} />
          <Route path="/docs/circle-gateway" element={<CircleGateway />} />
          <Route path="/docs/uniswap" element={<UniswapIntegration />} />
          <Route path="/docs/lifi" element={<LifiIntegration />} />
          <Route path="/docs/ens" element={<EnsIntegration />} />
          <Route path="/docs/discord-commands" element={<DiscordCommands />} />
          <Route path="/docs/approvals" element={<Approvals />} />
          <Route path="/docs/dashboard-guide" element={<DashboardGuide />} />
        </Route>

        {/* Redirect unknown routes to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
