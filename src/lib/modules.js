const moduleFiles = import.meta.glob('../modules/*/module.json', { eager: true })
const lessonFiles = import.meta.glob('../modules/*/lessons/*.json', { eager: true })

const unwrap = (entry) => (entry && entry.default !== undefined ? entry.default : entry)

const lessonPathFor = (moduleDir) => `../modules/${moduleDir}/lessons/`

const modules = Object.entries(moduleFiles)
  .map(([modulePath, entry]) => {
    const moduleDir = modulePath.split('/').at(-2)
    const data = unwrap(entry)
    const lessons = Object.entries(lessonFiles)
      .filter(([lessonPath]) => lessonPath.startsWith(lessonPathFor(moduleDir)))
      .map(([, lessonEntry]) => unwrap(lessonEntry))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id))

    return { ...data, lessons }
  })
  .sort((a, b) => (a.order ?? a.number ?? 0) - (b.order ?? b.number ?? 0))

export const getModules = () => modules

export const getModuleById = (id) => modules.find((module) => module.id === id)

export const getModuleViews = (module) => {
  const views = ['lesson']
  if (module.questions?.length) views.push('quiz')
  if (module.flashcards?.length) views.push('flash')
  if (module.summary?.html) views.push('summary')
  if (module.gallery?.collections?.length) views.push('gallery')
  if (module.references?.html) views.push('references')
  return views
}

export const getModuleProgress = (module) => {
  const total = module.lessons.length
  if (!total) return { completed: 0, total, percent: 0 }

  try {
    const stored = JSON.parse(localStorage.getItem(module.storageKey) || '{}')
    const done = new Set(Array.isArray(stored.done) ? stored.done : [])
    const completed = module.lessons.filter((lesson) => done.has(lesson.id)).length
    return {
      completed,
      total,
      percent: Math.round((completed / total) * 100),
    }
  } catch {
    return { completed: 0, total, percent: 0 }
  }
}
