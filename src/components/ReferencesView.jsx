import { withBasePath } from '../lib/utils.js'

export default function ReferencesView({ references }) {
  if (!references?.html) return null

  return (
    <section className="panel">
      <div className="sectionhead">
        <div className="eyebrow">منابع و راهنمای استفاده</div>
        <h2>{references.title}</h2>
        {references.intro && <p>{references.intro}</p>}
      </div>

      <div
        className="lessonbody"
        dangerouslySetInnerHTML={{ __html: withBasePath(references.html) }}
      />
    </section>
  )
}
