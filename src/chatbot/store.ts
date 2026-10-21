import { useSyncExternalStore } from "react";

import type { BotReply } from "./engine";
import type { RequestType } from "./knowledge";

export type UserMessage = { id: string; role: "user"; text: string };
export type BotMessage = BotReply & {
  id: string;
  role: "bot";
  /** Inline lead form state for this message. */
  lead?: "open" | "sent" | undefined;
  leadType?: RequestType | undefined;
};
export type ChatMessage = UserMessage | BotMessage;

type State = { messages: ChatMessage[]; misses: number; typing: boolean };

const KEY = "ssoussi.chat.v1";
const EMPTY: State = { messages: [], misses: 0, typing: false };

function load(): State {
  try {
    const raw = typeof window === "undefined" ? null : window.sessionStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const v = JSON.parse(raw) as Partial<State>;
    return Array.isArray(v.messages)
      ? { messages: v.messages, misses: Number(v.misses) || 0, typing: false }
      : EMPTY;
  } catch {
    return EMPTY;
  }
}

// One session per tab: survives page navigation and reloads, cleared when the tab closes.
let state: State | null = null;
const listeners = new Set<() => void>();

const get = () => (state ??= load());

export function setChat(update: Partial<State> | ((s: State) => Partial<State>)) {
  const prev = get();
  state = { ...prev, ...(typeof update === "function" ? update(prev) : update) };
  try {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({ messages: state.messages, misses: state.misses }),
    );
  } catch {
    // Storage blocked (private mode, quota): the conversation simply isn't kept.
  }
  listeners.forEach((l) => l());
}

export function updateMessage(id: string, patch: Partial<BotMessage>) {
  setChat((s) => ({
    messages: s.messages.map((m) => (m.id === id && m.role === "bot" ? { ...m, ...patch } : m)),
  }));
}

export function resetChat() {
  setChat(EMPTY);
}

export function useChatState() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    get,
    () => EMPTY,
  );
}

export const newId = () => Math.random().toString(36).slice(2, 10);
