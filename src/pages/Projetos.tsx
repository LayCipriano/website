import { useMemo, useRef, useState, useLayoutEffect } from "react"
import "../assets/estilo.css"

type Projeto = {
  id: number
  nome: string
  tagline: string
  stack: string[]
  url: string
  githubUrl?: string
}

type Posicao = { x: number; y: number }

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export default function Projetos() {
  const projetos: Projeto[] = useMemo(
    () => [
      {
        id: 1,
        nome: "Buscador de CEP",
        tagline: "Busca o endereço a partir do CEP, sem enrolação.",
        stack: ["React", "TypeScript", "ViaCEP API"],
        url: "https://buscadorcep.laycipriano.com.br",
        githubUrl: "#",
      },
      {
        id: 2,
        nome: "Gerenciador de Tarefas",
        tagline: "Organize tarefas de forma simples e com estilo 'miau'.",
        stack: ["React", "TypeScript", "LocalStorage"],
        url: "https://todolist.laycipriano.com.br",
        githubUrl: "#",
      },
      {
        id: 3,
        nome: "Em breve",
        tagline: "Logo teremos um novo projeto aqui",
        stack: ["Apenas Deus sabe o que eu vou inventar"],
        url: "https://laycipriano.com.br",
        githubUrl: "#",
      },
    ],
    []
  )

  const mapaRef = useRef<HTMLDivElement>(null)

  // posições por id (mais robusto do que array por index)
  const [posicoes, setPosicoes] = useState<Record<number, Posicao>>({})
  const [ativoId, setAtivoId] = useState<number>(projetos[0]?.id ?? 0)

  const ativo = projetos.find((p) => p.id === ativoId) ?? projetos[0]

  useLayoutEffect(() => {
    const el = mapaRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()

    const margem = 60
    const distanciaMinima = 140

    const minX = margem
    const maxX = rect.width - margem
    const minY = margem
    const maxY = rect.height - margem

    const geradas: Record<number, Posicao> = {}
    const usadas: Posicao[] = []

    for (const p of projetos) {
      let x = 0
      let y = 0
      let seguro = false
      let tentativas = 0

      while (!seguro && tentativas < 250) {
        x = Math.random() * (maxX - minX) + minX
        y = Math.random() * (maxY - minY) + minY

        seguro = usadas.every((u) => {
          const dx = u.x - x
          const dy = u.y - y
          return Math.sqrt(dx * dx + dy * dy) > distanciaMinima
        })

        tentativas++
      }

      const pos = { x, y }
      geradas[p.id] = pos
      usadas.push(pos)
    }

    setPosicoes(geradas)
  }, [projetos])

  const posAtivo = posicoes[ativoId]

  // painel não sair pra fora do mapa
  const painel = (() => {
    const el = mapaRef.current
    if (!el || !posAtivo) return { left: 0, top: 0, transform: "translate(18px, -50%)" }

    const w = el.clientWidth
    const h = el.clientHeight

    const painelLargura = Math.min(360, Math.floor(w * 0.7))
    const offsetX = 18

    // tenta abrir pra direita; se estourar, abre pra esquerda
    const abreDireita = posAtivo.x + offsetX + painelLargura <= w - 14

    const left = clamp(posAtivo.x, 14, w - 14)
    const top = clamp(posAtivo.y, 14, h - 14)

    return {
      left,
      top,
      transform: abreDireita ? "translate(18px, -50%)" : "translate(calc(-100% - 18px), -50%)",
    }
  })()

  return (
    <div className="container">
      <div className="container-content-projetos projeto-content">
        <div className="projetos-title">
          <div className="center">
            <h1 className="glow-h1-effect">PROJETOS</h1>
            <h3 className="glow-h2-effect">Clique nos pontos e explore</h3>
          </div>
        </div>

        <div className="mapa" ref={mapaRef}>
          {/* linhas: liga o ativo aos outros (em pixels, sem %) */}
          {posAtivo &&
            projetos.map((p) => {
              if (p.id === ativoId) return null
              const pos = posicoes[p.id]
              if (!pos) return null

              const dx = pos.x - posAtivo.x
              const dy = pos.y - posAtivo.y
              const len = Math.sqrt(dx * dx + dy * dy)
              const ang = Math.atan2(dy, dx)

              return (
                <div
                  key={`linha-${p.id}`}
                  className="linha-mapa"
                  style={{
                    left: posAtivo.x,
                    top: posAtivo.y,
                    width: `${len}px`,
                    transform: `rotate(${ang}rad)`,
                  }}
                />
              )
            })}

          {/* nós */}
          {projetos.map((p) => {
            const pos = posicoes[p.id]
            if (!pos) return null

            return (
              <button
                key={p.id}
                className={`node ${ativoId === p.id ? "is-active" : ""}`}
                style={{ left: pos.x, top: pos.y }}
                onClick={() => setAtivoId(p.id)}
                type="button"
                aria-label={`Abrir ${p.nome}`}
              />
            )
          })}

          {/* painel */}
          {posAtivo && (
            <div className="node-painel" style={painel}>
              <div className="titulo-painel">{ativo.nome}</div>
              <div className="texto-painel">{ativo.tagline}</div>
              <div className="stack-painel">{ativo.stack.join(" • ")}</div>

              <div className="acoes-painel">
                <a href={ativo.url} target="_blank" rel="noreferrer">
                  Abrir
                </a>
                {ativo.githubUrl && (
                  <a href={ativo.githubUrl} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}