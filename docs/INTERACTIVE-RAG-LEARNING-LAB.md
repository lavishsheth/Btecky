# Interactive RAG learning lab

The article `/blog/what-is-retrieval-augmented-generation-rag-a-practical-guide` includes an in-browser retrieval exercise in the shared article template.

## What the reader can do

- Enter a question or select one of the sample questions.
- Run retrieval against seven small, fictional course-note passages.
- Inspect the candidate source IDs, matched terms and query-term overlap score.
- Compare questions about permissions, retrieval evaluation and missing evidence.

## What the demonstration intentionally does not do

This is a teaching model of the retrieval stage, not a production RAG stack:
- It uses local keyword overlap, not an embedding model or vector database.
- It does not call an LLM or generate an answer.
- It does not use a reranker.
- The passages are illustrative sample content, not a real user's private documents.
- A score indicates token overlap only; it does not establish relevance, factual support or answer correctness.

The UI explains these limits beside the results. Do not label its percentage as semantic similarity, confidence, accuracy or probability.

## Security and accessibility

- All result content is inserted using DOM text nodes, never interpolated as HTML.
- Query length is bounded in the textarea.
- The result region uses an accessible live announcement.
- Example queries and the search control are keyboard-operable.
- No network request, external API, account data or user document is involved.

## Before extending the lab

If a future exercise connects to a real retrieval service, implement server-side authentication and authorization, enforce document permissions before retrieval results are sent to a model, validate source citations, rate-limit requests, protect secrets, and test prompt-injection content as untrusted data. Never rely on the language model to enforce access control.

## Validation

After changes, run `npm run check` and `npm run build`, then test:
1. Each example query populates results.
2. A custom query returns ranked matches.
3. An empty query shows a helpful message.
4. A query with no matching terms shows the no-match state.
5. The lab remains usable on mobile and with a keyboard.
