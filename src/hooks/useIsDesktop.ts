import { useEffect, useState } from "react"

export default function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(
    window.innerWidth >= 1024
  )

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isDesktop
}
