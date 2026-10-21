import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
const leaf = (path: string) => router.matchRoutes(path).at(-1);

describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    expect(leaf("/")?.routeId).not.toBe(rootRouteId);
  });

  it.each([
    ["/", "/{-$locale}/"],
    ["/en", "/{-$locale}/"],
    ["/savoir-faire", "/{-$locale}/savoir-faire"],
    ["/en/savoir-faire", "/{-$locale}/savoir-faire"],
    ["/collections", "/{-$locale}/collections/"],
    ["/collections/decoration", "/{-$locale}/collections/$category/"],
    ["/en/collections/decoration/vase-bouteille", "/{-$locale}/collections/$category/$slug"],
  ])("routes %s to %s", (path, id) => {
    expect(leaf(path)?.routeId).toBe(id);
  });

  it("keeps French paths free of a locale param", () => {
    expect(leaf("/savoir-faire")?.params).not.toHaveProperty("locale", "savoir-faire");
    expect(leaf("/en/savoir-faire")?.params).toHaveProperty("locale", "en");
  });
});
