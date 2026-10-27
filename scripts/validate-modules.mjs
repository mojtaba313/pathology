import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const modulesRoot = path.join(root, 'src/modules')
const errors = []
const warnings = []

const relative = (file) => path.relative(root, file)
const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
const isString = (value) => typeof value === 'string'
const isNonEmptyString = (value) => isString(value) && value.trim().length > 0
const isInteger = (value) => Number.isInteger(value)
const isPositiveInteger = (value) => isInteger(value) && value > 0
const isNonNegativeInteger = (value) => isInteger(value) && value >= 0
const isSlug = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)

const error = (file, message) => errors.push(`${relative(file)}: ${message}`)
const warn = (file, message) => warnings.push(`${relative(file)}: ${message}`)

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (cause) {
    error(file, `invalid JSON (${cause.message})`)
    return null
  }
}

const validateHtml = (file, field, value) => {
  if (!isNonEmptyString(value)) {
    error(file, `${field} must be a non-empty HTML string`)
    return
  }

  if (/<(script|style|iframe|object|embed)\b/i.test(value)) {
    error(file, `${field} must not contain script, style, iframe, object, or embed tags`)
  }
  if (/\son[a-z]+\s*=/i.test(value)) {
    error(file, `${field} must not contain inline event handlers`)
  }
  if (/javascript\s*:/i.test(value)) {
    error(file, `${field} must not contain javascript: URLs`)
  }
}

if (!fs.existsSync(modulesRoot)) {
  console.error(`ERROR ${relative(modulesRoot)}: directory does not exist`)
  process.exit(1)
}

const moduleDirs = fs
  .readdirSync(modulesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(modulesRoot, entry.name))
  .sort()

if (moduleDirs.length === 0) {
  console.error(`ERROR ${relative(modulesRoot)}: no module directories found`)
  process.exit(1)
}

const moduleIds = new Set()
const storageKeys = new Set()
let lessonCount = 0
let questionCount = 0
let flashcardCount = 0

for (const moduleDir of moduleDirs) {
  const moduleFile = path.join(moduleDir, 'module.json')

  if (!fs.existsSync(moduleFile)) {
    error(moduleDir, 'missing module.json')
    continue
  }

  const module = readJson(moduleFile)
  if (!isObject(module)) {
    error(moduleFile, 'module.json must contain a JSON object')
    continue
  }

  const requiredStrings = [
    'id',
    'title',
    'cardTitle',
    'eyebrow',
    'cardDescription',
    'description',
    'storageKey',
    'footer',
  ]

  for (const field of requiredStrings) {
    if (!isNonEmptyString(module[field])) {
      error(moduleFile, `${field} must be a non-empty string`)
    }
  }

  if (isNonEmptyString(module.id)) {
    if (!isSlug(module.id)) {
      error(moduleFile, 'id must be an ASCII slug such as "module-3"')
    }
    if (moduleIds.has(module.id)) {
      error(moduleFile, `duplicate module id "${module.id}"`)
    }
    moduleIds.add(module.id)

    const folderName = path.basename(moduleDir)
    if (folderName !== module.id) {
      warn(
        moduleFile,
        `folder "${folderName}" does not match module id "${module.id}"; this works but is not recommended`,
      )
    }
  }

  if (isNonEmptyString(module.storageKey)) {
    if (storageKeys.has(module.storageKey)) {
      error(moduleFile, `duplicate storageKey "${module.storageKey}"`)
    }
    storageKeys.add(module.storageKey)
  }

  if (!isPositiveInteger(module.order)) {
    error(moduleFile, 'order must be a positive integer')
  }
  if (!isPositiveInteger(module.number)) {
    error(moduleFile, 'number must be a positive integer')
  }
  if (module.pills !== undefined) {
    if (!Array.isArray(module.pills) || !module.pills.every(isNonEmptyString)) {
      error(moduleFile, 'pills must be an array of non-empty strings')
    }
  }
  if (module.quiz !== undefined) {
    if (!isObject(module.quiz)) {
      error(moduleFile, 'quiz must be an object')
    } else {
      for (const field of ['navLabel', 'title', 'description']) {
        if (module.quiz[field] !== undefined && !isNonEmptyString(module.quiz[field])) {
          error(moduleFile, `quiz.${field} must be a non-empty string when provided`)
        }
      }
    }
  }

  const lessonsDir = path.join(moduleDir, 'lessons')
  const lessons = []

  if (!fs.existsSync(lessonsDir)) {
    error(moduleDir, 'missing lessons/ directory')
  } else {
    const lessonFiles = fs
      .readdirSync(lessonsDir)
      .filter((name) => name.endsWith('.json'))
      .sort()
      .map((name) => path.join(lessonsDir, name))

    if (lessonFiles.length === 0) {
      error(lessonsDir, 'at least one lesson JSON file is required')
    }

    const lessonIds = new Set()
    const lessonOrders = new Set()

    for (const lessonFile of lessonFiles) {
      const lesson = readJson(lessonFile)
      if (!isObject(lesson)) {
        error(lessonFile, 'lesson must contain a JSON object')
        continue
      }

      for (const field of ['id', 'title', 'mins', 'source']) {
        if (!isNonEmptyString(lesson[field])) {
          error(lessonFile, `${field} must be a non-empty string`)
        }
      }

      if (isNonEmptyString(lesson.id)) {
        if (!isSlug(lesson.id)) {
          error(lessonFile, 'id must be an ASCII slug such as "first-topic"')
        }
        if (lessonIds.has(lesson.id)) {
          error(lessonFile, `duplicate lesson id "${lesson.id}"`)
        }
        lessonIds.add(lesson.id)
        lessons.push(lesson)
      }

      if (!isPositiveInteger(lesson.order)) {
        error(lessonFile, 'order must be a positive integer')
      } else if (lessonOrders.has(lesson.order)) {
        error(lessonFile, `duplicate lesson order "${lesson.order}"`)
      } else {
        lessonOrders.add(lesson.order)
      }

      if (lesson.summary !== undefined && !isString(lesson.summary)) {
        error(lessonFile, 'summary must be a string when provided')
      }

      validateHtml(lessonFile, 'html', lesson.html)
      lessonCount += 1
    }

    if (module.questions !== undefined) {
      if (!Array.isArray(module.questions)) {
        error(moduleFile, 'questions must be an array')
      } else {
        module.questions.forEach((question, index) => {
          const questionLabel = `questions[${index}]`
          if (!isObject(question)) {
            error(moduleFile, `${questionLabel} must be an object`)
            return
          }

          if (!isNonEmptyString(question.topic)) {
            error(moduleFile, `${questionLabel}.topic must be a non-empty string`)
          } else if (question.topic !== 'mixed' && !lessonIds.has(question.topic)) {
            error(
              moduleFile,
              `${questionLabel}.topic "${question.topic}" does not match a lesson id or "mixed"`,
            )
          }

          if (!isNonEmptyString(question.question)) {
            error(moduleFile, `${questionLabel}.question must be a non-empty string`)
          }
          if (!Array.isArray(question.choices) || question.choices.length !== 4) {
            error(moduleFile, `${questionLabel}.choices must contain exactly four strings`)
          } else if (!question.choices.every(isNonEmptyString)) {
            error(moduleFile, `${questionLabel}.choices must contain non-empty strings`)
          }
          if (
            !isInteger(question.correct) ||
            !Array.isArray(question.choices) ||
            question.correct < 0 ||
            question.correct >= question.choices.length
          ) {
            error(
              moduleFile,
              `${questionLabel}.correct must be a 0-based index into choices`,
            )
          }
          if (!isNonEmptyString(question.why)) {
            error(moduleFile, `${questionLabel}.why must be a non-empty string`)
          }
          questionCount += 1
        })
      }
    }

    if (module.flashcards !== undefined) {
      if (!Array.isArray(module.flashcards)) {
        error(moduleFile, 'flashcards must be an array')
      } else {
        module.flashcards.forEach((card, index) => {
          const cardLabel = `flashcards[${index}]`
          if (!isObject(card)) {
            error(moduleFile, `${cardLabel} must be an object`)
            return
          }
          if (!isNonEmptyString(card.term)) {
            error(moduleFile, `${cardLabel}.term must be a non-empty string`)
          }
          if (!isNonEmptyString(card.definition)) {
            error(moduleFile, `${cardLabel}.definition must be a non-empty string`)
          }
          flashcardCount += 1
        })
      }
    }

    if (module.summary !== undefined) {
      if (!isObject(module.summary)) {
        error(moduleFile, 'summary must be an object')
      } else {
        if (!isNonEmptyString(module.summary.title)) {
          error(moduleFile, 'summary.title must be a non-empty string')
        }
        if (
          module.summary.label !== undefined &&
          !isNonEmptyString(module.summary.label)
        ) {
          error(moduleFile, 'summary.label must be a non-empty string when provided')
        }
        validateHtml(moduleFile, 'summary.html', module.summary.html)
      }
    }

    if (module.references !== undefined) {
      if (!isObject(module.references)) {
        error(moduleFile, 'references must be an object')
      } else {
        if (!isNonEmptyString(module.references.title)) {
          error(moduleFile, 'references.title must be a non-empty string')
        }
        if (
          module.references.intro !== undefined &&
          !isNonEmptyString(module.references.intro)
        ) {
          error(moduleFile, 'references.intro must be a non-empty string when provided')
        }
        validateHtml(moduleFile, 'references.html', module.references.html)
      }
    }

    if (module.gallery !== undefined) {
      if (!isObject(module.gallery)) {
        error(moduleFile, 'gallery must be an object')
      } else {
        for (const field of ['title', 'intro']) {
          if (!isNonEmptyString(module.gallery[field])) {
            error(moduleFile, `gallery.${field} must be a non-empty string`)
          }
        }
        if (
          module.gallery.callout !== undefined &&
          !isNonEmptyString(module.gallery.callout)
        ) {
          error(moduleFile, 'gallery.callout must be a non-empty string when provided')
        }
        if (
          !Array.isArray(module.gallery.collections) ||
          module.gallery.collections.length === 0
        ) {
          error(moduleFile, 'gallery.collections must be a non-empty array')
        } else {
          const collectionIds = new Set()
          module.gallery.collections.forEach((collection, index) => {
            const collectionLabel = `gallery.collections[${index}]`
            if (!isObject(collection)) {
              error(moduleFile, `${collectionLabel} must be an object`)
              return
            }
            for (const field of ['id', 'label', 'unit', 'file']) {
              if (!isNonEmptyString(collection[field])) {
                error(
                  moduleFile,
                  `${collectionLabel}.${field} must be a non-empty string`,
                )
              }
            }
            if (isNonEmptyString(collection.id)) {
              if (collectionIds.has(collection.id)) {
                error(moduleFile, `duplicate gallery collection id "${collection.id}"`)
              }
              collectionIds.add(collection.id)
            }
            if (!isPositiveInteger(collection.pageCount)) {
              error(moduleFile, `${collectionLabel}.pageCount must be a positive integer`)
            }
            if (!isNonNegativeInteger(collection.pad)) {
              error(
                moduleFile,
                `${collectionLabel}.pad must be a non-negative integer`,
              )
            }
            if (isNonEmptyString(collection.file) && !collection.file.includes('{page}')) {
              error(
                moduleFile,
                `${collectionLabel}.file must contain the {page} placeholder`,
              )
            }
          })
        }
      }
    }
  }
}

if (warnings.length > 0) {
  console.warn(`Warnings (${warnings.length}):`)
  warnings.forEach((message) => console.warn(`  WARN ${message}`))
}

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} error(s):`)
  errors.forEach((message) => console.error(`  ERROR ${message}`))
  process.exit(1)
}

console.log(
  `Validated ${moduleDirs.length} module(s), ${lessonCount} lesson(s), ${questionCount} question(s), ${flashcardCount} flashcard(s).`,
)
