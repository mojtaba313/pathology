import { useState } from 'react'
import { faNum } from '../lib/utils.js'

export default function TopBar({ progress, theme, onSearch, onToggleTheme }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <form className="topbar" onSubmit={handleSubmit}>
      <input
        className="search"
        placeholder="جست‌وجو در درس‌ها، اصطلاحات و تست‌ها…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="جست‌وجو"
      />
      <div className="progressbox">
        <div className="progresslabel">
          <span>پیشرفت مطالعه</span>
          <b>{faNum(progress)}٪</b>
        </div>
        <div className="progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
      <button type="button" className="btn" onClick={onToggleTheme}>
        {theme === 'light' ? 'حالت تیره' : 'حالت روشن'}
      </button>
      <button type="button" className="btn" onClick={() => window.print()}>
        چاپ درس
      </button>
    </form>
  )
}
