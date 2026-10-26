import { useState } from 'react'
import { assetUrl, faNum } from '../lib/utils.js'

const EN_PAGES = 130
const FA_PAGES = 23
const PAGE_SIZE = 24

const pageNumbers = (type) =>
  Array.from({ length: type === 'en' ? EN_PAGES : FA_PAGES }, (_, index) => index + 1)

const pageSrc = (type, page) =>
  type === 'en'
    ? assetUrl(`assets/handouts/en/slide-${String(page).padStart(3, '0')}.jpg`)
    : assetUrl(`assets/handouts/fa/page-${String(page).padStart(2, '0')}.jpg`)

export default function GalleryView({ onOpenImage }) {
  const [type, setType] = useState('en')
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)

  const numbers = pageNumbers(type).filter(
    (page) => !search.trim() || String(page).includes(search.trim()),
  )
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
    setType('en')
    setSearch('')
    setLimit(PAGE_SIZE)
  }

  return (
    <section className="panel">
      <div className="sectionhead">
        <div className="eyebrow">اسناد اصلی درس</div>
        <h2>گالری کامل صفحات دو جزوه</h2>
        <p>
          همه صفحات هر دو PDF در فایل ZIP به صورت تصویر محلی آمده‌اند؛ روی هر صفحه
          کلیک کن تا بزرگ شود. این گالری کمک می‌کند شکل‌ها، نمودارها و متن‌های
          تصویری از قلم نیفتند.
        </p>
      </div>

      <div className="callout">
        گالری شامل ۱۳۰ اسلاید ارائه انگلیسی و ۲۳ صفحه جزوه فارسی است. برای این
        ماژول، صفحات مرتبط با مبانی ژنتیک را در بخش درس اشاره کرده‌ایم؛ صفحات بعدی
        در ماژول‌های آینده تدریس خواهند شد، اما نسخه تصویری آن‌ها همین‌جا در دسترس
        است.
      </div>

      <div className="gallerytools">
        <select
          value={type}
          onChange={(event) => selectType(event.target.value)}
          aria-label="نوع جزوه"
        >
          <option value="en">ارائه انگلیسی (۱۳۰ اسلاید)</option>
          <option value="fa">جزوه فارسی (۲۳ صفحه)</option>
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
        نمایش {faNum(shown.length)} از {faNum(numbers.length)} صفحه
      </div>

      <div className="gallery">
        {shown.map((page) => {
          const src = pageSrc(type, page)
          const title = `${type === 'en' ? 'اسلاید ارائه انگلیسی' : 'صفحه جزوه فارسی'} ${faNum(page)}`

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
                alt={`${type === 'en' ? 'اسلاید' : 'صفحه جزوه'} ${page}`}
              />
              <span>
                {type === 'en' ? 'اسلاید' : 'صفحه'} {faNum(page)}
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
