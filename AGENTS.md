<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shared navigation, footer, quote dialog and enquiry notifications in the root layout so every public page has the same working controls.
- Keep product, craft and editorial sample content in shared data modules so listings and detail pages use the same records.
- The assistant is rule-based and runs entirely in the browser (`src/chatbot/`, no AI or API key); its history lives in sessionStorage for the current tab only.
