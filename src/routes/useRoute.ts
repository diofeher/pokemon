import { useState, useCallback, useEffect } from "react";

export type AppRoute = "/" | "/pokedex" | "/map";

function getRoute(): AppRoute {
  const hash = window.location.hash.replace("#", "") || "/";
  if (hash === "/pokedex") return "/pokedex";
  if (hash === "/map") return "/map";
  return "/";
}

export function useRoute() {
  const [path, setPath] = useState<AppRoute>(getRoute);

  useEffect(() => {
    const onHashChange = () => setPath(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((route: AppRoute) => {
    window.location.hash = route;
  }, []);

  return { path, navigate };
}
