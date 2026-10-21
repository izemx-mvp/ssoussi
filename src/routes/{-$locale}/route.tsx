import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";

// `{-$locale}` is optional: absent → French (default), "en" → English. Anything else is a 404.
export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    if (params.locale !== undefined && params.locale !== "en") throw notFound();
  },
  component: Outlet,
});
