import { faNum } from '../lib/utils.js'

export default function Hero({ module }) {
  const lessonCount = module.lessons.length
  const questionCount = module.questions?.length || 0
  const flashcardCount = module.flashcards?.length || 0

  return (
    <header className="hero">
      <div className="eyebrow">{module.eyebrow}</div>
      <h1>{module.title}</h1>
      <p>{module.description}</p>
      <div className="pills">
        <span className="pill">{faNum(lessonCount)} بخش آموزشی</span>
        {questionCount > 0 && (
          <span className="pill">{faNum(questionCount)} سؤال چهارگزینه‌ای</span>
        )}
        {flashcardCount > 0 && (
          <span className="pill">{faNum(flashcardCount)} فلش‌کارت</span>
        )}
        {(module.pills || []).map((pill) => (
          <span className="pill" key={pill}>
            {pill}
          </span>
        ))}
        <span className="pill">آفلاین</span>
      </div>
    </header>
  )
}
