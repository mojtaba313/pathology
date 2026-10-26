import { useState } from 'react'
import { assetUrl, faNum } from '../lib/utils.js'

const PAGE_SIZE = 24

const pageSrc = (collection, page) =>
  assetUrl(
    collection.file.replace('{page}', String(page).padStart(collection.pad || 0, '0')),
  )

export default function GalleryView({ gallery, onOpenImage }) {
  const collections = gallery.collections || []
  const [type, setType] = useState(collections[0]?.id || '')
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)

  if (!collections.length) return null

  const collection = collections.find((item) => item.id === type) || collections[0]
  const numbers = Array.from(
    { length: collection.pageCount },
    (_, index) => index + 1,
  ).filter((page) => !search.trim() || String(page).includes(search.trim()))
  const shown = numbers.slice(0, limit)

  const selectType = (value) => {
    setType(value)
    setLimit(PAGE_SIZE)
  }

  const updateSearch = (value) => {
    setSearch(value)
    setLimit(PAGE_SIZE)
  }

  const reset = () => {
    setType(collections[0].id)
    setSearch('')
    setLimit(PAGE_SIZE)
  }

  return (
    <section className="panel">
      <div className="sectionhead">
        <div className="eyebrow">اسناد اصلی درس</div>
        <h2>{gallery.title}</h2>
        <p>{gallery.intro}</p>
      </div>

      {gallery.callout && <div className="callout">{gallery.callout}</div>}

      <div className="gallerytools">
        <select
          value={collection.id}
          onChange={(event) => selectType(event.target.value)}
          aria-label="نوع جزوه"
        >
          {collections.map((item) => (
            <option value={item.id} key={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
          placeholder="شماره صفحه / عبارت مثل 12"
          type="search"
          aria-label="جست‌وجوی شماره صفحه"
        />
        <button type="button" className="btn" onClick={reset}>
          بازنشانی
        </button>
      </div>

      <div className="small">
        نمایش {faNum(shown.length)} از {faNum(numbers.length)} {collection.unit}
      </div>

      <div className="gallery">
        {shown.map((page) => {
          const src = pageSrc(collection, page)
          const title = `${collection.unit} ${faNum(page)}`

          return (
            <button
              type="button"
              className="thumb"
              key={src}
              onClick={() => onOpenImage(src, title)}
            >
              <img
                loading="lazy"
                src={src}
                alt={`${collection.unit} ${page}`}
              />
              <span>
                {collection.unit} {faNum(page)}
              </span>
            </button>
          )
        })}
      </div>

      {shown.length < numbers.length && (
        <div className="quizfooter">
          <button
            type="button"
            className="btn"
            onClick={() => setLimit((current) => current + PAGE_SIZE)}
          >
            نمایش صفحات بعدی
          </button>
        </div>
      )}
    </section>
  )
}
