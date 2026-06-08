# Rick and Morty — Character Browser

Browse all 826 Rick and Morty characters across 42 pages. Search as you type, navigate with full browser back/forward support, and get instant results from cache on pages you've already visited.

[View live →](https://deeptiwari690.github.io/rick-and-morty-character-browser/)

## Features

- Paginated grid with URL sync — `?page=N` is always bookmarkable and shareable
- Debounced search — fetches filter results 500ms after typing stops
- In-memory cache with 5-minute TTL — revisiting a page skips the network
- AbortController — in-flight requests are cancelled on fast navigation
- Browser back/forward via `popstate` — no React Router

## Stack

React · TypeScript · Vite · Zod · CSS
