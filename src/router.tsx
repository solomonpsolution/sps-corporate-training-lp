import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    // The page lives at /corporate-training-lp. The main website proxies it and
    // drops the final "/", so the address must work without it.
    rewrite: {
      input: ({ url }) => {
        if (url.pathname === "/corporate-training-lp") url.pathname = "/";
        else if (url.pathname.startsWith("/corporate-training-lp/")) url.pathname = url.pathname.slice(22);
        return url;
      },
      output: ({ url }) => {
        url.pathname = url.pathname === "/" ? "/corporate-training-lp" : `/corporate-training-lp${url.pathname}`;
        return url;
      },
    },
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
