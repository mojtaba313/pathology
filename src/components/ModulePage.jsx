import { useEffect, useMemo, useState } from 'react'
import Hero from './Hero.jsx'
import TopBar from './TopBar.jsx'
import Sidebar from './Sidebar.jsx'
import LessonView from './LessonView.jsx'
import QuizView from './QuizView.jsx'
import FlashcardsView from './FlashcardsView.jsx'
import GalleryView from './GalleryView.jsx'
import ReferencesView from './ReferencesView.jsx'
import SummaryView from './SummaryView.jsx'
import Modal from './Modal.jsx'
import { getModuleViews } from '../lib/modules.js'
import { faNum, stripHtml } from '../lib/utils.js'

const createDefaultState = (module) => ({
  done: [],
  special: 'lesson',
  lesson: 0,
  quizIndices: (module.questions || []).map((_, index) => index),
  answers: {},
  submitted: {},
  flashIndex: 0,
  flashBack: false,
  theme: 'dark',
})

const loadState = (module) => {
  const base = createDefaultState(module)
  const questions = module.questions || []
  const flashcards = module.flashcards || []
  const views = getModuleViews(module)

  try {
    const stored = JSON.parse(localStorage.getItem(module.storageKey) || '{}')
    const merged = { ...base, ...stored }
    const validLessonIds = new Set(module.lessons.map((lesson) => lesson.id))

    merged.done = Array.isArray(merged.done)
      ? merged.done.filter((lessonId) => validLessonIds.has(lessonId))
      : []

    if (!views.includes(merged.special)) merged.special = 'lesson'

    const lesson = Number(merged.lesson)
    merged.lesson =
      Number.isFinite(lesson) && module.lessons.length
        ? Math.min(Math.max(Math.trunc(lesson), 0), module.lessons.length - 1)
        : 0

    merged.quizIndices = Array.isArray(merged.quizIndices)
      ? merged.quizIndices.filter(
          (questionIndex) =>
            Number.isInteger(questionIndex) &&
            questionIndex >= 0 &&
            questionIndex < questions.length,
        )
      : []
    if (merged.quizIndices.length === 0) {
      merged.quizIndices = questions.map((_, index) => index)
    }

    if (!merged.answers || typeof merged.answers !== 'object') merged.answers = {}
    if (!merged.submitted || typeof merged.submitted !== 'object') merged.submitted = {}

    const flashIndex = Number(merged.flashIndex)
    merged.flashIndex =
      Number.isFinite(flashIndex) && flashcards.length
        ? ((Math.trunc(flashIndex) % flashcards.length) + flashcards.length) %
          flashcards.length
        : 0

    merged.theme = merged.theme === 'light' ? 'light' : 'dark'
    merged.flashBack = Boolean(merged.flashBack)

    return merged
  } catch {
    return base
  }
}

export default function ModulePage({ module }) {
  const [state, setState] = useState(() => loadState(module))
  const [search, setSearch] = useState(null)
  const [modalImage, setModalImage] = useState(null)

  const questions = module.questions || []
  const flashcards = module.flashcards || []
  const lessons = module.lessons || []
  const views = getModuleViews(module)

  useEffect(() => {
    try {
      localStorage.setItem(module.storageKey, JSON.stringify(state))
    } catch {
      return
    }
  }, [module.storageKey, state])

  useEffect(() => {
    document.body.classList.toggle('lightmode', state.theme === 'light')
  }, [state.theme])

  useEffect(
    () => () => {
      document.body.classList.remove('lightmode')
    },
    [],
  )

  const completedCount = lessons.filter((lesson) => state.done.includes(lesson.id)).length
  const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0
  const submittedKeys = Object.keys(state.submitted)
  const correctAnswers = submittedKeys.filter((key) => state.submitted[key]).length
  const quizScore = submittedKeys.length
    ? `${faNum(correctAnswers)}/${faNum(submittedKeys.length)}`
    : ''

  const activeLesson = useMemo(
    () => lessons[state.lesson] || lessons[0],
    [lessons, state.lesson],
  )

  const selectLesson = (index) => {
    setSearch(null)
    setState((current) => ({ ...current, special: 'lesson', lesson: index }))
  }

  const selectSpecial = (special) => {
    if (!views.includes(special)) return
    setSearch(null)
    setState((current) => ({ ...current, special }))
  }

  const toggleDone = (lessonId) => {
    setState((current) => {
      if (current.done.includes(lessonId)) return current
      return { ...current, done: [...current.done, lessonId] }
    })
  }

  const handleSearch = (rawQuery) => {
    const query = rawQuery.trim()
    if (!query) return

    const needle = query.toLowerCase()
    const found = lessons
      .map((lesson, index) => ({ lesson, index }))
      .filter(({ lesson }) =>
        `${lesson.title} ${stripHtml(lesson.html)}`.toLowerCase().includes(needle),
      )

    if (found.length === 0) {
      const fallback = module.references?.html
        ? 'references'
        : module.summary?.html
          ? 'summary'
          : 'lesson'
      setState((current) => ({ ...current, special: fallback }))
      window.alert(
        'عبارت داخل عنوان/محتوای متنی این ماژول پیدا نشد. بخش‌های دیگر ماژول را بررسی کن.',
      )
      return
    }

    setSearch({ query, found })
    setState((current) => ({
      ...current,
      special: 'lesson',
      lesson: found[0].index,
    }))
  }

  const goToSearchResult = (index) => {
    setState((current) => ({ ...current, special: 'lesson', lesson: index }))
  }

  const answerQuestion = (questionIndex, choice) => {
    setState((current) => ({
      ...current,
      answers: { ...current.answers, [questionIndex]: choice },
    }))
  }

  const checkQuestion = (questionIndex) => {
    if (state.answers[questionIndex] === undefined) {
      window.alert('ابتدا یک گزینه انتخاب کن.')
      return
    }

    const question = questions[questionIndex]
    if (!question) return

    setState((current) => ({
      ...current,
      submitted: {
        ...current.submitted,
        [questionIndex]: current.answers[questionIndex] === question.correct,
      },
    }))
  }

  const submitAll = () => {
    setState((current) => {
      const submitted = { ...current.submitted }
      current.quizIndices.forEach((questionIndex) => {
        const question = questions[questionIndex]
        if (question && current.answers[questionIndex] !== undefined) {
          submitted[questionIndex] =
            current.answers[questionIndex] === question.correct
        }
      })
      return { ...current, submitted }
    })
  }

  const shuffleQuiz = () => {
    setState((current) => ({
      ...current,
      quizIndices: [...current.quizIndices].sort(() => Math.random() - 0.5),
      answers: {},
      submitted: {},
    }))
  }

  const resetQuiz = () => {
    setState((current) => ({ ...current, answers: {}, submitted: {} }))
  }

  const changeFlashIndex = (updater) => {
    if (!flashcards.length) return
    setState((current) => ({
      ...current,
      flashIndex: updater(current.flashIndex),
      flashBack: false,
    }))
  }

  const renderContent = () => {
    if (state.special === 'quiz') {
      return (
        <QuizView
          title={module.quiz?.title}
          description={module.quiz?.description}
          questions={questions}
          lessons={lessons}
          indices={state.quizIndices}
          answers={state.answers}
          submitted={state.submitted}
          onAnswer={answerQuestion}
          onCheck={checkQuestion}
          onSubmitAll={submitAll}
          onShuffle={shuffleQuiz}
          onReset={resetQuiz}
        />
      )
    }

    if (state.special === 'flash') {
      return (
        <FlashcardsView
          flashcards={flashcards}
          index={state.flashIndex}
          back={state.flashBack}
          onPrev={() =>
            changeFlashIndex(
              (index) => (index + flashcards.length - 1) % flashcards.length,
            )
          }
          onNext={() => changeFlashIndex((index) => (index + 1) % flashcards.length)}
          onFlip={() =>
            setState((current) => ({ ...current, flashBack: !current.flashBack }))
          }
          onRandom={() =>
            changeFlashIndex(() => Math.floor(Math.random() * flashcards.length))
          }
        />
      )
    }

    if (state.special === 'summary') {
      return <SummaryView summary={module.summary} />
    }

    if (state.special === 'gallery') {
      return (
        <GalleryView
          gallery={module.gallery}
          onOpenImage={(src, title) => setModalImage({ src, title })}
        />
      )
    }

    if (state.special === 'references') {
      return <ReferencesView references={module.references} />
    }

    if (!activeLesson) {
      return <section className="panel">درسی برای این ماژول ثبت نشده است.</section>
    }

    return (
      <LessonView
        lesson={activeLesson}
        lessonIndex={state.lesson}
        total={lessons.length}
        isDone={state.done.includes(activeLesson.id)}
        search={search}
        onPrev={() => selectLesson(Math.max(0, state.lesson - 1))}
        onNext={() => selectLesson(Math.min(lessons.length - 1, state.lesson + 1))}
        onToggleDone={() => toggleDone(activeLesson.id)}
        onOpenQuiz={() => selectSpecial(questions.length ? 'quiz' : 'lesson')}
        onGotoSearchResult={goToSearchResult}
      />
    )
  }

  return (
    <div className="wrap">
      <Hero module={module} />

      <TopBar
        progress={progress}
        theme={state.theme}
        onSearch={handleSearch}
        onToggleTheme={() =>
          setState((current) => ({
            ...current,
            theme: current.theme === 'light' ? 'dark' : 'light',
          }))
        }
      />

      <div className="layout">
        <Sidebar
          module={module}
          special={state.special}
          activeLesson={state.lesson}
          done={state.done}
          quizScore={quizScore}
          onSelectLesson={selectLesson}
          onSelectSpecial={selectSpecial}
        />
        <main className="content">{renderContent()}</main>
      </div>

      <div className="footer">{module.footer}</div>

      <Modal image={modalImage} onClose={() => setModalImage(null)} />
    </div>
  )
}
