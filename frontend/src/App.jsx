import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import WatchList from './pages/WatchList'
import WatchForm from './pages/WatchForm'
import WatchDetail from './pages/WatchDetail'
import TimekeepingPage from './pages/TimekeepingPage'
import MaintenancePage from './pages/MaintenancePage'
import WearingPage from './pages/WearingPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="watches" element={<WatchList />} />
        <Route path="watches/new" element={<WatchForm />} />
        <Route path="watches/:id" element={<WatchDetail />} />
        <Route path="watches/:id/edit" element={<WatchForm />} />
        <Route path="watches/:id/timekeeping" element={<TimekeepingPage />} />
        <Route path="watches/:id/maintenance" element={<MaintenancePage />} />
        <Route path="watches/:id/wearing" element={<WearingPage />} />
      </Route>
    </Routes>
  )
}
