import { useEffect, useMemo, useRef } from 'react'
import { faNum, highlightHtml } from '../lib/utils.js'

export default function LessonView({
  lesson,
  lessonIndex,
  total,
  isDone,
  search,
  onPrev,
  onNext,
  onToggleDone,
  onOpenQuiz,
  onGotoSearchResult,
}) {
  const bodyRef = useRef(null)

  const html = useMemo(
    () => (search?.query ? highlightHtml(lesson.html, search.query) : lesson.html),
    [lesson.html, search],
  )

  useEffect(() => {
    bodyRef.current?.querySelectorAll('a').forEach((anchor) => {
      anchor.setAttribute('target', '_blank')
      anchor.setAttribute('rel', 'noreferrer')
    })
  }, [html])

  return (
    <>
      {search?.found?.length > 0 && (
        <section className="panel searchresults">
          <b>نتیجه جست‌وجو برای «{search.query}»</b>
          <p>
            {search.found.map((result) => (
              <button
                key={result.index}
                type="button"
                className="btn"
                onClick={() => onGotoSearchResult(result.index)}
              >
                {result.lesson.title}
              </button>
            ))}
          </p>
        </section>
      )}

      <section className="panel">
        <div className="sectionhead">
          <div className="eyebrow">
            بخش {faNum(lessonIndex + 1)} از {faNum(total)}
          </div>
          <h2>{lesson.title}</h2>
          <p>زمان پیشنهادی: {lesson.mins}</p>
          <div className="meta">
            <span className="tag">مبنای محتوا: جزوه‌های درسی</span>
            <span className="tag">افزوده‌های آموزشی: چارچوب رابینز</span>
          </div>
          <p className="small">{lesson.source}</p>
        </div>
        <div
          className="lessonbody"
          ref={bodyRef}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="sectionend">
          <button type="button" className="btn" onClick={onPrev} disabled={lessonIndex === 0}>
            ← بخش قبلی
          </button>
          <button
            type="button"
            className={`btn ${isDone ? '' : 'primary'}`}
            onClick={onToggleDone}
          >
            {isDone ? '✓ این بخش مرور شده' : 'علامت‌گذاری به‌عنوان مطالعه‌شده'}
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={onNext}
            disabled={lessonIndex === total - 1}
          >
            بخش بعدی →
          </button>
        </div>
      </section>

      <section className="panel">
        <h3>بازیابی فعال در ۳۰ ثانیه</h3>
        <p>
          بدون برگشتن به متن، در یک جمله مهم‌ترین تمایز این بخش را با صدای بلند
          توضیح بده. سپس خودت جواب را با تیترها و جدول همین بخش مقایسه کن.
        </p>
        <button type="button" className="btn" onClick={onOpenQuiz}>
          رفتن به آزمون جامع
        </button>
      </section>
    </>
  )
}
