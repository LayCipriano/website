import { useEffect, useLayoutEffect, useRef, useState } from "react"

const words = [
  "Programação",
  "Desenvolvimento",
  "Tecnologia",
  "Inovação",
  "Criatividade",
  "Soluções",
  "Conexão",
  "Transformação",
  "Impacto",
  "Perseverança",
  "User Experience",
  "Fé",
  "Determinação",
  "Cristo",
  "Palavra",
  "2 Coríntios 12:9",
  "Propósito",
  "Chamado",
  "Missão",
  "Amor",
]

type WordPos = {
  x: number
  y: number
  r: number
}

function measureTextWidth(text: string, font: string) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return text.length * 10
  ctx.font = font
  return ctx.measureText(text).width
}

export default function Home() {
  const titleRef = useRef<HTMLDivElement>(null)

  const [positions, setPositions] = useState<WordPos[]>([])
  const [titleRect, setTitleRect] = useState<DOMRect | null>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  // mouse global
  useEffect(() => {
    const handleMove = (e: MouseEvent) =>
      setMouse({ x: e.clientX, y: e.clientY })

    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [])

  // geração das posições
  useLayoutEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    const rect = titleRef.current?.getBoundingClientRect()
    if (!rect) return

    setTitleRect(rect)

    const padding = 40
    const titleMargin = 40

    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize || "16"
    )

    const fontPx = 1.1 * rootFontSize
    const font = `${Math.round(
      fontPx
    )}px system-ui, -apple-system, Segoe UI, Roboto, Arial`

    const generated: WordPos[] = []

    for (const w of words) {
      const textWidth = measureTextWidth(w.toUpperCase(), font)
      const r = Math.max(40, textWidth / 2 + 14)

      let safe = false
      let attempts = 0
      let x = 0
      let y = 0

      const minX = padding + r
      const maxX = width - padding - r
      const minY = padding + fontPx
      const maxY = height - padding - fontPx

      while (!safe && attempts < 300) {
        x = Math.random() * (maxX - minX) + minX
        y = Math.random() * (maxY - minY) + minY

        // evita área do título
        const insideTitle =
          x > rect.left - titleMargin &&
          x < rect.right + titleMargin &&
          y > rect.top - titleMargin &&
          y < rect.bottom + titleMargin

        if (insideTitle) {
          attempts++
          continue
        }

        // evita sobreposição entre palavras
        safe = generated.every((p) => {
          const dx = p.x - x
          const dy = p.y - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          return dist > p.r + r
        })

        attempts++
      }

      generated.push({ x, y, r })
    }

    setPositions(generated)
  }, [])

  return (
    <div className="container">

      <div className="container-content">
        <div className="center center-home" ref={titleRef}>
          <h1 className="glow-h1-effect">EU SOU A LAY</h1>
          <h2 className="glow-h2-effect">CÓDIGO • DESIGN • IDEIA</h2>
        </div>

        {titleRect &&
          positions.map((pos, index) => {
            const word = words[index]

            // ===== AURA BASEADA NO RETÂNGULO DO TÍTULO =====
            const dxRect = Math.max(
              titleRect.left - pos.x,
              0,
              pos.x - titleRect.right
            )

            const dyRect = Math.max(
              titleRect.top - pos.y,
              0,
              pos.y - titleRect.bottom
            )

            const dRect = Math.sqrt(dxRect * dxRect + dyRect * dyRect)

            const auraRadius = 220
            const aura = Math.max(0, 1 - dRect / auraRadius)

            const opacity = 0.22 * (1 - aura) + 0.05
            const scale = 1 - aura * 0.08

            // ===== MOVIMENTO PELO MOUSE =====
            const dx = mouse.x - pos.x
            const dy = mouse.y - pos.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            const maxDistance = 180
            const influence = Math.max(
              0,
              1 - distance / maxDistance
            )

            const moveX = -dx * 0.05 * influence
            const moveY = -dy * 0.05 * influence

            return (
              <span
                key={word}
                className="cloud-word"
                style={{
                  left: pos.x,
                  top: pos.y,
                  opacity,
                  filter: `blur(${aura * 1.2}px)`,
                  transform: `translate(-50%, -50%) translate(${moveX}px, ${moveY}px) scale(${scale})`,
                }}
              >
                {word}
              </span>
            )
          })}
      </div>
    </div>
  )
}
