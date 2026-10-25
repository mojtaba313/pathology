import { useEffect } from 'react'

export default function Modal({ image, onClose }) {
  useEffect(() => {
    if (!image) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [image, onClose])

  if (!image) return null

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="modalinner">
        <div className="modalbar">
          <b>{image.title}</b>
          <button type="button" className="btn" onClick={onClose}>
            بستن ×
          </button>
        </div>
        <img src={image.src} alt="نمای بزرگ صفحه جزوه" />
      </div>
    </div>
  )
}
