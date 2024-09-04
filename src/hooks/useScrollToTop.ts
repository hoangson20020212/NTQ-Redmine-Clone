import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A custom hook that scrolls the window to the top whenever the pathname changes.
 */
export default function useScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
}
