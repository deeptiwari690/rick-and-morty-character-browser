import { ApiResponseSchema } from "./schema";

export async function fetchPage(page: number, name: string, signal: AbortSignal) {
  const url = name
    ? `https://rickandmortyapi.com/api/character?page=${page}&name=${name}`
    : `https://rickandmortyapi.com/api/character?page=${page}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  const raw = await response.json();
  const parsed = ApiResponseSchema.parse(raw);
  return parsed;
}
