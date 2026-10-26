import { useEffect, useState } from 'react'
import ModuleListPage from './components/ModuleListPage.jsx'
import ModulePage from './components/ModulePage.jsx'
import { getModuleById, getModules } from './lib/modules.js'

const readRoute = () => {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [type, id] = raw.split('/')
  if (type === 'module' && id) return { moduleId: decodeURIComponent(id) }
  return { moduleId: null }
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const modules = getModules()

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(readRoute())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const activeModule = route.moduleId ? getModuleById(route.moduleId) : null

  useEffect(() => {
    document.title = activeModule
      ? `${activeModule.cardTitle || activeModule.title} — درس‌یار پاتولوژی ژنتیک`
      : 'درس‌یار پاتولوژی ژنتیک — ماژول‌های درس'
  }, [activeModule])

  if (!activeModule) {
    return <ModuleListPage modules={modules} />
  }

  return <ModulePage key={activeModule.id} module={activeModule} />
}
