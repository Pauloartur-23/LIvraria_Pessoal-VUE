const palettes = [
  ['#0f766e', '#134e4a'],
  ['#b45309', '#78350f'],
  ['#1d4ed8', '#1e3a8a'],
  ['#7c3aed', '#5b21b6'],
  ['#b91c1c', '#7f1d1d'],
  ['#065f46', '#064e3b'],
  ['#0f172a', '#1e293b'],
  ['#a16207', '#713f12']
]

const escapeXml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const wrap = (text, max) => {
  const words = String(text).split(/\s+/)
  const lines = []
  let current = ''
  for (const word of words) {
    if ((current + ' ' + word).trim().length > max && current) {
      lines.push(current.trim())
      current = word
    } else {
      current = (current + ' ' + word).trim()
    }
  }
  if (current) lines.push(current.trim())
  return lines
}

/**
 * Gera uma capa SVG (data URI) elegante para livros sem imagem real.
 */
export function coverFor(book) {
  if (book.img) return book.img

  const hash = [...String(book.id)].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const [c1, c2] = palettes[hash % palettes.length]
  const lines = wrap(book.titulo, 16).slice(0, 3)
  const titleTop = 380
  const titleSize = lines.length > 1 ? 46 : 58

  const titleText = lines
    .map(
      (line, i) =>
        `<text x="300" y="${titleTop + i * 62}" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" font-weight="bold" fill="#ffffff" text-anchor="middle">${escapeXml(line)}</text>`
    )
    .join('')

  const authorY = titleTop + lines.length * 62 + 24
  const footerY = authorY + 110

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="900" fill="url(#g)"/>
  <circle cx="520" cy="60" r="170" fill="rgba(255,255,255,0.06)"/>
  <circle cx="40" cy="840" r="140" fill="rgba(255,255,255,0.05)"/>
  <rect x="30" y="30" width="540" height="840" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
  <text x="300" y="150" font-family="Georgia, serif" font-size="22" letter-spacing="6" fill="rgba(255,255,255,0.55)" text-anchor="middle">IFBOOKS</text>
  <line x1="250" y1="180" x2="350" y2="180" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
  ${titleText}
  <line x1="240" y1="${authorY + 6}" x2="360" y2="${authorY + 6}" stroke="rgba(255,255,255,0.45)" stroke-width="2"/>
  <text x="300" y="${authorY + 40}" font-family="Georgia, serif" font-size="24" fill="rgba(255,255,255,0.85)" text-anchor="middle">${escapeXml(book.autor)}</text>
  <text x="300" y="${footerY}" font-family="Georgia, serif" font-size="18" fill="rgba(255,255,255,0.5)" text-anchor="middle">IFbooks · Livraria online</text>
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
