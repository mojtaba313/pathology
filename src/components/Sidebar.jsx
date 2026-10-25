import { cleanTitle, faNum } from '../lib/utils.js'

const specials = [
  { id: 'quiz', label: '🧠 آزمون جامع', score: true },
  { id: 'flash', label: '🗂 فلش‌کارت‌ها' },
  { id: 'gallery', label: '🖼 گالری همه صفحات جزوه‌ها' },
  { id: 'references', label: '📚 منابع و روش استفاده' },
]

export default function Sidebar({
  lessons,
  special,
  activeLesson,
  done,
  quizScore,
  onSelectLesson,
  onSelectSpecial,
}) {
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
