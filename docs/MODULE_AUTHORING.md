# Module Authoring Guide

This document is the contract for adding new modules to the pathology study app. It is written for both humans and AI agents.

The app is a static React/Vite app. Modules are discovered automatically at build time; you do **not** need to edit React components or routing to add a normal module.

## TL;DR

1. Create `src/modules/module-<n>/module.json`.
2. Create one JSON file per lesson in `src/modules/module-<n>/lessons/`.
3. Put images under `public/assets/` and PDFs under `public/sources/`.
4. Run `npm run validate:modules`.
5. Run `npm run build`.

Copy the starter files from [`docs/module-template`](./module-template) if useful.

## Directory layout

```text
src/modules/
  module-3/
    module.json
    lessons/
      01-first-topic.json
      02-second-topic.json
      03-third-topic.json
```

- The module folder name is not displayed in the UI, but use `module-<number>` for consistency.
- `src/lib/modules.js` discovers `src/modules/*/module.json` and `src/modules/*/lessons/*.json` automatically.
- Lesson files are sorted by their `order` field.
- Do **not** add a `lessons` array to `module.json`; lesson files are the source of truth.

## Hard rules

- Files must be valid UTF-8 JSON. No comments and no trailing commas.
- Use double quotes for all JSON strings.
- Module `id` must be a unique ASCII slug, for example `module-3`.
- `storageKey` must be unique and should be versioned, for example `geneticPathologyModule3.v1`.
- Do not change `storageKey` after publishing a module unless you intentionally want to reset learner progress.
- Lesson `id` values must be unique inside the module and stable.
- Every question `topic` must match a lesson `id`, or be exactly `"mixed"` for integrated questions.
- `questions[].correct` is a **0-based index** into `choices`:
  - first option = `0`
  - second option = `1`
  - third option = `2`
  - fourth option = `3`
- Lesson HTML is a fragment, not a complete HTML document. Do not include `<html>`, `<head>`, `<body>`, `<script>`, `<style>`, event handlers such as `onclick`, or iframes.
- The UI is Persian and RTL. Write student-facing content in Persian.
- Use root-absolute asset paths such as `/assets/images/example.svg`; do not use relative `../../` paths.
- No app code changes are needed for a normal new module. Only change app code if you need a genuinely new view type or a new global style.

## `module.json` reference

### Core fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Unique ASCII slug. Used in `#/module/<id>`. |
| `order` | number | yes | Sort order in the module list. |
| `number` | number | yes | Module number displayed in the UI. Use a Latin digit. |
| `title` | string | yes | Full title shown in the hero. |
| `cardTitle` | string | yes | Short title shown on the module list card and in the browser tab. |
| `eyebrow` | string | yes | Small label above the hero title. |
| `cardDescription` | string | yes | Short description shown on the module list card. |
| `description` | string | yes | Longer description shown in the module hero. |
| `storageKey` | string | yes | Unique localStorage key for this module's progress and settings. |
| `pills` | string[] | no | Extra hero pills. Counts are generated automatically. |
| `footer` | string | yes | Footer text under the module. |

### Quiz and questions

```json
"quiz": {
  "navLabel": "آزمون جامع",
  "title": "آزمون جامع ماژول سوم",
  "description": "توضیح کوتاه آزمون."
},
"questions": [
  {
    "topic": "first-topic",
    "question": "متن سؤال؟",
    "choices": [
      "گزینه اول",
      "گزینه دوم",
      "گزینه سوم",
      "گزینه چهارم"
    ],
    "correct": 1,
    "why": "توضیح علت درست بودن پاسخ و بررسی گزینه‌ها."
  }
]
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `quiz` | object | no | Optional metadata for the quiz view. |
| `quiz.navLabel` | string | no | Sidebar label. Defaults to `آزمون جامع`. |
| `quiz.title` | string | no | Quiz page title. |
| `quiz.description` | string | no | Quiz page description. |
| `questions` | array | no | If non-empty, the quiz view is added automatically. |
| `questions[].topic` | string | yes | Must be a lesson `id` or `"mixed"`. |
| `questions[].question` | string | yes | Question text. |
| `questions[].choices` | string[] | yes | Exactly four choices in the current UI. |
| `questions[].correct` | integer | yes | 0-based correct choice index. |
| `questions[].why` | string | yes | Explanation shown after checking. |

### Flashcards

```json
"flashcards": [
  {
    "term": "اصطلاح",
    "definition": "تعریف کوتاه و دقیق."
  }
]
```

Flashcards are rendered in array order and the flashcard view is added automatically when the array is non-empty.

### Optional summary view

```json
"summary": {
  "label": "جمع‌بندی سریع",
  "title": "جمع‌بندی سریع و تمایزهای پرامتیاز",
  "html": "<table><thead><tr><th>اگر سؤال گفت…</th><th>به این فکر کن</th></tr></thead><tbody><tr><td>…</td><td>…</td></tr></tbody></table>"
}
```

- `summary.html` is rendered inside the standard lesson body styles.
- Do not start `summary.html` with an `<h2>`; `summary.title` is already rendered as the page heading.
- Use `<h3>` for sections inside the HTML.
- The summary view is added only when `summary.html` is a non-empty string.

### Optional gallery view

```json
"gallery": {
  "title": "گالری صفحات جزوه",
  "intro": "توضیح کوتاه درباره گالری.",
  "callout": "نکته اختیاری بالای گالری.",
  "collections": [
    {
      "id": "en",
      "label": "ارائه انگلیسی (۳۰ اسلاید)",
      "unit": "اسلاید",
      "pageCount": 30,
      "pad": 3,
      "file": "assets/handouts/module-3/slide-{page}.jpg"
    }
  ]
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `gallery.title` | string | yes | Gallery page title. |
| `gallery.intro` | string | yes | Intro under the title. |
| `gallery.callout` | string | no | Optional callout above the gallery. |
| `gallery.collections` | array | yes | At least one collection. |
| `collections[].id` | string | yes | Unique inside the gallery. |
| `collections[].label` | string | yes | Option label in the collection selector. |
| `collections[].unit` | string | yes | Displayed unit, for example `اسلاید` or `صفحه`. |
| `collections[].pageCount` | integer | yes | Number of pages, starting at page 1. |
| `collections[].pad` | integer | yes | Zero-padding width, for example `3` for `001`. |
| `collections[].file` | string | yes | Path relative to `public/`, containing `{page}`. |

The app replaces `{page}` with the page number and prepends the Vite base path. Put the actual images in `public/assets/...`.

### Optional references view

```json
"references": {
  "title": "چطور از این ماژول استفاده کنم؟",
  "intro": "توضیح کوتاه.",
  "html": "<h3>منابع</h3><ul><li><a href=\"/sources/file.pdf\" target=\"_blank\" rel=\"noreferrer\">PDF اصلی</a></li></ul>"
}
```

- `references.html` is rendered inside the standard lesson body styles.
- Use root-absolute `/sources/...` links for files in `public/sources/`.
- External `https://` links are left unchanged.
- The references view is added only when `references.html` is a non-empty string.

## Lesson JSON reference

Each file in `src/modules/<module>/lessons/` represents one lesson.

```json
{
  "id": "first-topic",
  "order": 1,
  "title": "۱) عنوان درس",
  "mins": "۱۵ دقیقه",
  "source": "جزوه انگلیسی: اسلایدهای ۱–۵؛ تکمیل آموزشی با Robbins",
  "summary": "یک یا دو جمله برای معرفی درس و هدف آن.",
  "html": "<div class=\"callout\"><b>هدف این بخش:</b> …</div>\n<h3>۱) عنوان زیربخش</h3>\n<p>متن درس…</p>"
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Unique inside the module; stable; referenced by question `topic`. |
| `order` | number | yes | Sort order; must be unique inside the module. |
| `title` | string | yes | Lesson title. Leading Persian/Latin numbers followed by `.` or `)` are stripped in the sidebar. |
| `mins` | string | yes | Displayed as suggested time, for example `۱۵ دقیقه`. |
| `source` | string | yes | Source note displayed under the lesson header. |
| `summary` | string | no | Plain-text lead shown under the lesson title. |
| `html` | string | yes | Lesson body HTML fragment. |

### Lesson HTML contract

The lesson HTML is inserted into:

```html
<div class="lessonbody">…lesson.html…</div>
```

Use the existing content classes so dark/light mode and print styles keep working:

| Class | Purpose |
| --- | --- |
| `callout` | Standard highlighted note. |
| `callout warn` | Warning/high-yield note. |
| `note` | Amber study note. |
| `exam` | Exam-tip box. |
| `figure` + `figcap` | Figure wrapper and caption. |
| `statgrid` | Grid of key numbers; children are `<div><b>…</b><span>…</span></div>`. |
| `cards2` | Two-column cards; children are `<article>`. |
| `flow` | Simple flow diagram; use `<span>` boxes and `<i>→</i>` arrows. |
| `diagram` | Larger diagram wrapper. |
| `step` / `step accent` | Boxes inside a `diagram`. |
| `small` | Small secondary text. |

Normal HTML elements such as `<h3>`, `<h4>`, `<p>`, `<ul>`, `<ol>`, `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`, `<b>`, `<strong>`, `<a>`, `<img>` are supported.

Recommended content rules:

- Start the body with an `<h3>` or a `callout`, not an `<h2>`.
- Do not use inline `<style>` blocks.
- Do not use JavaScript, inline event handlers, or external scripts.
- For lesson images, use `/assets/images/...`.
- For source PDFs, use `/sources/...`.
- Keep asset file names Latin and URL-safe even if the visible content is Persian.
- Set `target="_blank"` and `rel="noreferrer"` on external links in `summary.html` and `references.html` if you want them to open in a new tab. Lesson links are handled automatically.

### Writing HTML inside JSON

HTML must be JSON-escaped. The safest approach for AI-generated modules is to build data in Python/Node and serialize it with a JSON library:

```python
import json

module = {
    "id": "module-3",
    "title": "ماژول ۳: …",
    # …
}

with open("src/modules/module-3/module.json", "w", encoding="utf-8") as file:
    json.dump(module, file, ensure_ascii=False, indent=2)
    file.write("\n")
```

For lesson HTML, use a normal multiline string in the generation script, then let the JSON library escape quotes and newlines. Do not hand-edit large escaped HTML strings unless necessary.

## How views are discovered

| View | Added when |
| --- | --- |
| Lessons | Always; at least one lesson file is required. |
| Quiz | `questions` is a non-empty array. |
| Flashcards | `flashcards` is a non-empty array. |
| Summary | `summary.html` is a non-empty string. |
| Gallery | `gallery.collections` is a non-empty array. |
| References | `references.html` is a non-empty string. |

## Validation

Run:

```bash
npm run validate:modules
```

`npm run build` also runs this validation before Vite builds.

The validator checks:

- JSON parsing
- required fields and types
- unique module IDs and storage keys
- unique lesson IDs and order values
- question `correct` indices and `topic` references
- gallery collection configuration
- forbidden `<script>`, `<style>`, and inline event handlers in lesson HTML

Fix all errors before committing a new module.

## AI agent prompt

Use a prompt like this when asking another AI to create a module:

```text
You are adding a new module to the React/Vite pathology app in this repository.

Before writing anything:
1. Read docs/MODULE_AUTHORING.md completely.
2. Read docs/module-template/module.json and docs/module-template/lessons/01-example-topic.json.
3. Inspect src/modules/module-1 and src/modules/module-2 for real examples.

Requirements:
- Create src/modules/module-<N>/module.json.
- Create one JSON file per lesson in src/modules/module-<N>/lessons/.
- Use a unique ASCII module id and a unique versioned storageKey.
- Write all student-facing content in Persian and keep the existing RTL style.
- Question correct indices are 0-based.
- Every question topic must be a lesson id or "mixed".
- Use only the HTML classes documented in the guide.
- Do not edit React components unless the guide explicitly requires it.
- Do not add comments or trailing commas to JSON.
- Run npm run validate:modules and then npm run build.
- Report the created files and validation/build results.
```

## Pre-commit checklist

- [ ] Module folder is `src/modules/module-<n>/`.
- [ ] `module.json` has unique `id` and `storageKey`.
- [ ] At least one lesson file exists.
- [ ] Lesson `order` values are unique and sort correctly.
- [ ] Every question `topic` exists or is `"mixed"`.
- [ ] Every `correct` index points to the intended option (0-based).
- [ ] Gallery paths contain `{page}` and the real images exist.
- [ ] Source PDFs exist under `public/sources/`.
- [ ] Lesson HTML has no scripts, styles, or event handlers.
- [ ] `npm run validate:modules` passes.
- [ ] `npm run build` passes.
- [ ] The module appears in the module list and opens at `#/module/<id>`.
