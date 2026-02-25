import DesktopLayout from "./layouts/DesktopLayout.tsx";
import MobileLayout from "./layouts/MobileLayout.tsx";
import useIsDesktop from "./hooks/useIsDesktop.ts";

export default function App() {
  const isDesktop = useIsDesktop();

  return isDesktop ? <DesktopLayout /> : <MobileLayout />
}