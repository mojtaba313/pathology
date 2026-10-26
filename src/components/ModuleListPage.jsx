import { faNum } from '../lib/utils.js'
import { getModuleProgress } from '../lib/modules.js'

export default function ModuleListPage({ modules }) {
  const totalLessons = modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  )
  const totalQuestions = modules.reduce(
    (total, module) => total + (module.questions?.length || 0),
    0,
  )
  const totalFlashcards = modules.reduce(
    (total, module) => total + (module.flashcards?.length || 0),
    0,
  )

  return (
    <div className="wrap">
      <header className="hero homehero">
        <div className="eyebrow">درس‌یار تعاملی • پاتولوژی</div>
        <h1>ماژول‌های درس</h1>
        <p>
          یک ماژول را انتخاب کن. هر ماژول درس‌ها، آزمون، فلش‌کارت و بخش‌های مرور
          خودش را دارد و پیشرفت هر ماژول جداگانه در همین مرورگر ذخیره می‌شود.
        </p>
        <div className="pills">
          <span className="pill">{faNum(modules.length)} ماژول</span>
          <span className="pill">{faNum(totalLessons)} بخش آموزشی</span>
          <span className="pill">{faNum(totalQuestions)} سؤال چهارگزینه‌ای</span>
          <span className="pill">{faNum(totalFlashcards)} فلش‌کارت</span>
          <span className="pill">آفلاین</span>
        </div>
      </header>

      <div className="modulegrid">
        {modules.map((module) => {
          const progress = getModuleProgress(module)
          const isComplete = progress.total > 0 && progress.percent === 100

          return (
            <article className="panel modulecard" key={module.id}>
              <div className="modulecardtop">
                <span className="modulebadge">ماژول {faNum(module.number)}</span>
                {isComplete && <span className="tag">تکمیل‌شده</span>}
              </div>
              <h2>{module.cardTitle || module.title}</h2>
              <p>{module.cardDescription || module.description}</p>
              <div className="modulemeta">
                <span>{faNum(module.lessons.length)} درس</span>
                <span>{faNum(module.questions?.length || 0)} سؤال</span>
                <span>{faNum(module.flashcards?.length || 0)} فلش‌کارت</span>
                {module.gallery?.collections?.length > 0 && <span>گالری</span>}
                {module.summary?.html && <span>جمع‌بندی</span>}
              </div>
              <div className="moduleprogress">
                <div className="progress">
                  <span style={{ width: `${progress.percent}%` }} />
                </div>
                <div className="progresslabel">
                  <span>
                    {faNum(progress.completed)} از {faNum(progress.total)} درس
                  </span>
                  <b>{faNum(progress.percent)}٪</b>
                </div>
              </div>
              <a className="btn primary modulebtn" href={`#/module/${module.id}`}>
                {progress.completed > 0 ? 'ادامه ماژول' : 'ورود به ماژول'}
              </a>
            </article>
          )
        })}
      </div>

      <div className="footer">
        محتوای آموزشی مستقل، بر پایه جزوه‌های آپلودشده و تکمیل‌شده با چارچوب
        رابینز. این فایل آفلاین است و اطلاعات شخصی جمع‌آوری نمی‌کند.
      </div>
    </div>
  )
}
