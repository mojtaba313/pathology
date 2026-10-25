import { useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero.jsx'
import TopBar from './components/TopBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import LessonView from './components/LessonView.jsx'
import QuizView from './components/QuizView.jsx'
import FlashcardsView from './components/FlashcardsView.jsx'
import GalleryView from './components/GalleryView.jsx'
import ReferencesView from './components/ReferencesView.jsx'
import Modal from './components/Modal.jsx'
import { LESSONS } from './data/lessons.js'
import { QUESTIONS } from './data/questions.js'
import { FLASHCARDS } from './data/flashcards.js'
import { faNum, stripHtml } from './lib/utils.js'

const STORAGE_KEY = 'geneticPathologyModule1.v2'
const VIEWS = ['lesson', 'quiz', 'flash', 'gallery', 'references']

const defaultQuizIndices = () => QUESTIONS.map((_, index) => index)

const defaultState = {
  done: [],
  special: 'lesson',
  lesson: 0,
  quizIndices: defaultQuizIndices(),
  answers: {},
  submitted: {},
  flashIndex: 0,
  flashBack: false,
  theme: 'dark',
}

const loadState = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const merged = { ...defaultState, ...stored }

    if (!Array.isArray(merged.done)) merged.done = []
    if (!Array.isArray(merged.quizIndices) || merged.quizIndices.length === 0) {
      merged.quizIndices = defaultQuizIndices()
    }
    if (!merged.answers || typeof merged.answers !== 'object') merged.answers = {}
    if (!merged.submitted || typeof merged.submitted !== 'object') merged.submitted = {}
    if (!VIEWS.includes(merged.special)) merged.special = 'lesson'

    const lesson = Number(merged.lesson)
    merged.lesson = Number.isFinite(lesson)
      ? Math.min(Math.max(lesson, 0), LESSONS.length - 1)
      : 0

    const flashIndex = Number(merged.flashIndex)
    merged.flashIndex = Number.isFinite(flashIndex)
      ? ((flashIndex % FLASHCARDS.length) + FLASHCARDS.length) % FLASHCARDS.length
      : 0

    merged.theme = merged.theme === 'light' ? 'light' : 'dark'
    merged.flashBack = Boolean(merged.flashBack)

    return merged
  } catch {
    return { ...defaultState, quizIndices: defaultQuizIndices() }
  }
}

export default function App() {
  const [state, setState] = useState(loadState)
  const [search, setSearch] = useState(null)
  const [modalImage, setModalImage] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      return
    }
  }, [state])

  useEffect(() => {
    document.body.classList.toggle('lightmode', state.theme === 'light')
  }, [state.theme])

  const progress = Math.round((state.done.length / LESSONS.length) * 100)
  const submittedKeys = Object.keys(state.submitted)
  const correctAnswers = submittedKeys.filter((key) => state.submitted[key]).length
  const quizScore = submittedKeys.length
    ? `${faNum(correctAnswers)}/${faNum(submittedKeys.length)}`
    : ''

  const activeLesson = useMemo(
    () => LESSONS[state.lesson] || LESSONS[0],
    [state.lesson],
  )

  const selectLesson = (index) => {
    setSearch(null)
    setState((current) => ({ ...current, special: 'lesson', lesson: index }))
  }

  const selectSpecial = (special) => {
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
    const found = LESSONS.map((lesson, index) => ({ lesson, index })).filter(({ lesson }) =>
      `${lesson.title} ${stripHtml(lesson.html)}`.toLowerCase().includes(needle),
    )

    if (found.length === 0) {
      setState((current) => ({ ...current, special: 'references' }))
      window.alert(
        'عبارت داخل عنوان/محتوای متنی درس پیدا نشد. گالری صفحات اصلی جزوه را هم بررسی کن.',
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

    setState((current) => ({
      ...current,
      submitted: {
        ...current.submitted,
        [questionIndex]: current.answers[questionIndex] === QUESTIONS[questionIndex].correct,
      },
    }))
  }

  const submitAll = () => {
    setState((current) => {
      const submitted = { ...current.submitted }
      current.quizIndices.forEach((questionIndex) => {
        if (current.answers[questionIndex] !== undefined) {
          submitted[questionIndex] =
            current.answers[questionIndex] === QUESTIONS[questionIndex].correct
        }
      })
      return { ...current, submitted }
    })
  }

  const shuffleQuiz = () => {
    const shuffled = [...state.quizIndices].sort(() => Math.random() - 0.5)
    setState((current) => ({
      ...current,
      quizIndices: shuffled,
      answers: {},
      submitted: {},
    }))
  }

  const resetQuiz = () => {
    setState((current) => ({ ...current, answers: {}, submitted: {} }))
  }

  const changeFlashIndex = (updater) => {
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
          questions={QUESTIONS}
          lessons={LESSONS}
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
          flashcards={FLASHCARDS}
          index={state.flashIndex}
          back={state.flashBack}
          onPrev={() =>
            changeFlashIndex(
              (index) => (index + FLASHCARDS.length - 1) % FLASHCARDS.length,
            )
          }
          onNext={() =>
            changeFlashIndex((index) => (index + 1) % FLASHCARDS.length)
          }
          onFlip={() =>
            setState((current) => ({ ...current, flashBack: !current.flashBack }))
          }
          onRandom={() =>
            changeFlashIndex(() => Math.floor(Math.random() * FLASHCARDS.length))
          }
        />
      )
    }

    if (state.special === 'gallery') {
      return (
        <GalleryView
          onOpenImage={(src, title) => setModalImage({ src, title })}
        />
      )
    }

    if (state.special === 'references') {
      return <ReferencesView />
    }

    return (
      <LessonView
        lesson={activeLesson}
        lessonIndex={state.lesson}
        total={LESSONS.length}
        isDone={state.done.includes(activeLesson.id)}
        search={search}
        onPrev={() => selectLesson(Math.max(0, state.lesson - 1))}
        onNext={() => selectLesson(Math.min(LESSONS.length - 1, state.lesson + 1))}
        onToggleDone={() => toggleDone(activeLesson.id)}
        onOpenQuiz={() => selectSpecial('quiz')}
        onGotoSearchResult={goToSearchResult}
      />
    )
  }

  return (
    <div className="wrap">
      <Hero
        lessonCount={LESSONS.length}
        questionCount={QUESTIONS.length}
        flashcardCount={FLASHCARDS.length}
      />

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
          lessons={LESSONS}
          special={state.special}
          activeLesson={state.lesson}
          done={state.done}
          quizScore={quizScore}
          onSelectLesson={selectLesson}
          onSelectSpecial={selectSpecial}
        />
        <main className="content">{renderContent()}</main>
      </div>

      <div className="footer">
        محتوای آموزشی مستقل، بر پایه جزوه‌های آپلودشده و تکمیل‌شده با چارچوب
        رابینز. این فایل آفلاین است و اطلاعات شخصی جمع‌آوری نمی‌کند.
      </div>

      <Modal image={modalImage} onClose={() => setModalImage(null)} />
    </div>
  )
}
