import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  /** Scrolling behavior when navigating between routes */
  behavior?: ScrollBehavior;
};

/**
 * Scrolls the window to the top on pathname changes so each page starts at the top.
 * Place inside a Router, outside of Routes.
 */
export default function ScrollToTop({ behavior = "auto" }: Props) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, behavior]);

  return null;
}
