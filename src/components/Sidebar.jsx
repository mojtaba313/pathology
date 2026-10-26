import { cleanTitle, faNum } from '../lib/utils.js'

const buildSpecials = (module) => {
  const specials = []
  if (module.questions?.length) {
    specials.push({
      id: 'quiz',
      label: module.quiz?.navLabel || '🧠 آزمون جامع',
      score: true,
    })
  }
  if (module.flashcards?.length) {
    specials.push({ id: 'flash', label: '🗂 فلش‌کارت‌ها' })
  }
  if (module.summary?.html) {
    specials.push({ id: 'summary', label: module.summary.label || '📌 جمع‌بندی سریع' })
  }
  if (module.gallery?.collections?.length) {
    specials.push({ id: 'gallery', label: '🖼 گالری همه صفحات جزوه‌ها' })
  }
  if (module.references?.html) {
    specials.push({ id: 'references', label: '📚 منابع و روش استفاده' })
  }
  return specials
}

export default function Sidebar({
  module,
  special,
  activeLesson,
  done,
  quizScore,
  onSelectLesson,
  onSelectSpecial,
}) {
  const lessons = module.lessons || []
  const specials = buildSpecials(module)

  return (
    <aside className="side">
      <h3>مطالب ماژول</h3>
      <div id="lessonNav">
        {lessons.map((lesson, index) => {
          const isDone = done.includes(lesson.id)
          return (
            <button
              key={lesson.id}
              type="button"
              className={`navitem ${special === 'lesson' && activeLesson === index ? 'active' : ''}`}
              onClick={() => onSelectLesson(index)}
            >
              <span className="num">{faNum(index + 1)}</span>
              <span>{cleanTitle(lesson.title)}</span>
              <span className="done">{isDone ? '✓' : ''}</span>
            </button>
          )
        })}
      </div>
      {specials.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`navitem ${special === item.id ? 'active' : ''}`}
          onClick={() => onSelectSpecial(item.id)}
        >
          {item.label}
          {item.score && <span className="done">{quizScore}</span>}
        </button>
      ))}
      <hr style={{ borderColor: 'var(--line)', width: '100%' }} />
      <div className="small" style={{ padding: '5px 8px' }}>
        پیشرفت در همین مرورگر ذخیره می‌شود. برای چند دانشجو، هر نفر پیشرفت
        جداگانه در دستگاه خودش خواهد داشت.
      </div>
    </aside>
  )
}
