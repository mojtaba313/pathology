import { cleanTitle, faNum } from '../lib/utils.js'

const resultMessage = (percent) => {
  if (percent < 70) {
    return 'تمرکز بعدی: بخش‌هایی را که در آن‌ها اشتباه داشتی دوباره بخوان و پس از فاصله زمانی تست را تکرار کن.'
  }
  if (percent < 90) {
    return 'خوب است؛ برای امتحان سخت، دام‌های جدول جمع‌بندی و علت مولکولی مثال‌ها را هم از حفظ توضیح بده.'
  }
  return 'عملکرد قوی در این بانک سؤال؛ برای اطمینان، سؤالات را با ترتیب جدید دوباره حل کن و صفحات اصلی جزوه را هم ببین.'
}

export default function QuizView({
  questions,
  lessons,
  indices,
  answers,
  submitted,
  onAnswer,
  onCheck,
  onSubmitAll,
  onShuffle,
  onReset,
}) {
  const submittedKeys = Object.keys(submitted)
  const score = submittedKeys.filter((key) => submitted[key]).length
  const percent = submittedKeys.length
    ? Math.round((score / submittedKeys.length) * 100)
    : 0

  return (
    <section className="panel">
      <div className="sectionhead">
        <div className="eyebrow">آزمون فعال</div>
        <h2>آزمون جامع ماژول اول</h2>
        <p>
          سؤال‌ها را تک‌به‌تک یا همه را یکجا پاسخ بده. هر پاسخ، علت درست/نادرست
          بودن گزینه‌ها را نشان می‌دهد.
        </p>
      </div>

      <div className="quiztop">
        <span className="tag">{faNum(questions.length)} سؤال مفهومی و بالینی</span>
        <button type="button" className="btn" onClick={onShuffle}>
          ترتیب تصادفی
        </button>
        <button type="button" className="btn" onClick={onReset}>
          شروع دوباره
        </button>
        <button type="button" className="btn primary" onClick={onSubmitAll}>
          تصحیح همه پاسخ‌ها
        </button>
      </div>

      {submittedKeys.length > 0 && (
        <div className="quizresult">
          <b>
            نتیجه فعلی: {faNum(score)} از {faNum(submittedKeys.length)} ({faNum(percent)}٪)
          </b>
          <p>
            این درصد فقط بر اساس سؤال‌هایی است که تا اینجا تصحیح شده‌اند؛ برای
            ارزیابی نهایی همه سؤال‌ها را پاسخ بده.
          </p>
          {resultMessage(percent)}
        </div>
      )}

      <div id="quizList">
        {indices.map((questionIndex, position) => {
          const question = questions[questionIndex]
          const answer = answers[questionIndex]
          const isSubmitted = Object.prototype.hasOwnProperty.call(submitted, questionIndex)
          const lesson = lessons.find((item) => item.id === question.topic)

          return (
            <article className="quizcard" key={questionIndex}>
              <div className="qnum">
                سؤال {faNum(position + 1)} •{' '}
                {lesson ? cleanTitle(lesson.title) : 'ترکیبی'}
              </div>
              <div className="qtext">{question.question}</div>
              <div className="options">
                {question.choices.map((choice, optionIndex) => {
                  let className = 'option'
                  if (isSubmitted && optionIndex === question.correct) {
                    className += ' correct'
                  } else if (
                    isSubmitted &&
                    answer === optionIndex &&
                    optionIndex !== question.correct
                  ) {
                    className += ' wrong'
                  }

                  return (
                    <label className={className} key={optionIndex}>
                      <input
                        type="radio"
                        name={`q${questionIndex}`}
                        value={optionIndex}
                        checked={answer === optionIndex}
                        disabled={isSubmitted}
                        onChange={() => onAnswer(questionIndex, optionIndex)}
                      />
                      <span>
                        {String.fromCharCode(65 + optionIndex)}. {choice}
                      </span>
                    </label>
                  )
                })}
              </div>

              {isSubmitted && (
                <div className="feedback">
                  <b>{answer === question.correct ? 'پاسخ درست' : 'پاسخ نادرست'}</b>
                  {' — '}
                  {question.why}
                </div>
              )}

              <div className="quizfooter">
                <button
                  type="button"
                  className="btn"
                  onClick={() => onCheck(questionIndex)}
                  disabled={isSubmitted}
                >
                  بررسی پاسخ
                </button>
                <span className="small">
                  {isSubmitted ? 'پاسخ ثبت شد' : 'پاسخ را انتخاب کن'}
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
