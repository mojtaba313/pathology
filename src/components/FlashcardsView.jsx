import { faNum } from '../lib/utils.js'

export default function FlashcardsView({
  flashcards,
  index,
  back,
  onPrev,
  onNext,
  onFlip,
  onRandom,
}) {
  if (!flashcards.length) return null

  const safeIndex = index % flashcards.length
  const card = flashcards[safeIndex]

  return (
    <section className="panel">
      <div className="sectionhead">
        <div className="eyebrow">مرور فعال</div>
        <h2>فلش‌کارت‌ها</h2>
        <p>
          روی کارت کلیک کن تا پاسخ نشان داده شود. بهتر است قبل از برگرداندن کارت،
          پاسخ را با صدای بلند بگویی.
        </p>
      </div>

      <div className="flashcard" onClick={onFlip}>
        {back ? (
          <div>
            <h3>پاسخ</h3>
            <p>{card.definition}</p>
          </div>
        ) : (
          <div>
            <div className="qnum">
              کارت {faNum(safeIndex + 1)} از {faNum(flashcards.length)}
            </div>
            <h3>{card.term}</h3>
            <p>برای دیدن توضیح کلیک کن</p>
          </div>
        )}
      </div>

      <div className="flashcontrols">
        <button type="button" className="btn" onClick={onPrev}>
          قبلی
        </button>
        <button type="button" className="btn primary" onClick={onFlip}>
          برگرداندن کارت
        </button>
        <button type="button" className="btn" onClick={onNext}>
          بعدی
        </button>
        <button type="button" className="btn" onClick={onRandom}>
          تصادفی
        </button>
      </div>

      <p className="small" style={{ textAlign: 'center' }}>
        یادآوری: فلش‌کارت ابزار مرور است و جایگزین مطالعه و آزمون مفهومی نیست.
      </p>
    </section>
  )
}
