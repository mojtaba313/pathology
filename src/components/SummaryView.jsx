import { withBasePath } from '../lib/utils.js'

export default function SummaryView({ summary }) {
  if (!summary?.html) return null

  return (
    <section className="panel">
      <div className="sectionhead">
        <div className="eyebrow">جمع‌بندی</div>
        <h2>{summary.title}</h2>
      </div>
      <div
        className="lessonbody summarybody"
        dangerouslySetInnerHTML={{ __html: withBasePath(summary.html) }}
      />
    </section>
  )
}
