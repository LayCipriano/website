import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronUp, ChevronRight } from "lucide-react";
import Home from "../pages/Home.tsx";
import Projetos from "../pages/Projetos.tsx";
import Sobre from "../pages/Sobre.tsx";
import Blog from "../pages/Blog.tsx";
import Contato from "../pages/Contato.tsx";

type Page = "home" | "projetos" | "sobre" | "blog" | "contato"
type Dir = "up" | "down" | "left" | "right"

const NAV: Record<Page, Partial<Record<Dir, Page>>> = {
  home: { left: "blog", right: "sobre", down: "projetos" },
  sobre: { left: "home" },
  blog: { right: "home" },
  projetos: { up: "home", down: "contato" },
  contato: { up: "projetos" },
}

const DURATION_MS = 520

function renderPage(page: Page) {
  switch (page) {
    case "home":
      return <Home />
    case "sobre":
      return <Sobre />
    case "blog":
      return <Blog />
    case "projetos":
      return <Projetos />
    case "contato":
      return <Contato />
  }
}

export default function DesktopLayout() {
  const [page, setPage] = useState<Page>("home")

  // transição
  const [nextPage, setNextPage] = useState<Page | null>(null)
  const [dir, setDir] = useState<Dir>("down")
  const [phase, setPhase] = useState<"idle" | "animating">("idle")

  const timerRef = useRef<number | null>(null)

  const go = (direction: Dir) => {
    if (phase === "animating") return

    const target = NAV[page][direction]
    if (!target) return

    setDir(direction)
    setNextPage(target)
    setPhase("animating")

    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setPage(target)
      setNextPage(null)
      setPhase("idle")
    }, DURATION_MS)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go("left")
      else if (e.key === "ArrowRight") go("right")
      else if (e.key === "ArrowUp") go("up")
      else if (e.key === "ArrowDown") go("down")
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [page, phase])

  const currentClass =
    nextPage && phase === "animating" ? `panel exit exit-${dir}` : "panel"

  const nextClass =
    nextPage && phase === "animating"
      ? `panel enter enter-${dir} enter-active`
      : `panel enter enter-${dir}`

  return (
    <div className="desktop-viewport">
      <div className="stage">
        {/* conteúdo atual */}
        <div className={currentClass}>{renderPage(page)}</div>

        {/* conteúdo entrando */}
        {nextPage && <div className={nextClass}>{renderPage(nextPage)}</div>}
      </div>

      {/* HUD fixo */}
      <div className="nav-overlay">
        {NAV[page].left && (
          <div className="nav-arrow nav-left" onClick={() => go("left")} role="button" aria-label="Esquerda">
           <ChevronLeft size={24} />
          </div>
        )}
        {NAV[page].right && (
          <div className="nav-arrow nav-right" onClick={() => go("right")} role="button" aria-label="Direita">
            <ChevronRight size={24} />
          </div>
        )}
        {NAV[page].up && (
          <div className="nav-arrow nav-up" onClick={() => go("up")} role="button" aria-label="Cima">
            <ChevronUp size={24} />
          </div>
        )}
        {NAV[page].down && (
          <div className="nav-arrow nav-down" onClick={() => go("down")} role="button" aria-label="Baixo">
            <ChevronDown size={24} />
          </div>
        )}
      </div>
    </div>
  )
}