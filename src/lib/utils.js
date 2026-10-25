export const faNum = (value) =>
  String(value).replace(/[0-9]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])

export const stripHtml = (html) => html.replace(/<[^>]*>/g, ' ')

export const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const cleanTitle = (title) =>
  title.replace(/^[0-9۰-۹]+\)\s*/, '')

export const highlightHtml = (html, query) => {
  if (!query) return html

  const pattern = new RegExp(`(${escapeRegExp(query)})`, 'gi')

  return html
    .split(/(<[^>]*>)/)
    .map((part) =>
      part.startsWith('<') ? part : part.replace(pattern, '<mark class="search-highlight">$1</mark>'),
    )
    .join('')
}
