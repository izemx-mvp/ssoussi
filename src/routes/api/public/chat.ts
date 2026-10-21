import { createFileRoute } from "@tanstack/react-router";

// POST /api/public/chat — streams the Ssoussi assistant (AI SDK UI-message stream).
// The handler lives in a .server module so gateway helpers never reach the client bundle.
export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleChat } = await import("@/lib/ai/assistant.server");
        return handleChat(request);
      },
    },
  },
});
