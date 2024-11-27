import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Create from '@/pages/Create';
import VoiceStudio from '@/pages/VoiceStudio';
import Team from '@/pages/Team';
import Projects from '@/pages/Projects';
import Analytics from '@/pages/Analytics';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/create" element={<Create />} />
      <Route path="/dashboard/voice-studio" element={<VoiceStudio />} />
      <Route path="/dashboard/team" element={<Team />} />
      <Route path="/dashboard/projects" element={<Projects />} />
      <Route path="/dashboard/analytics" element={<Analytics />} />
    </Routes>
  );
}

export default App;