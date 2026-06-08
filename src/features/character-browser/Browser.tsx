import { useState, useId, useEffect, useRef } from "react";
import { Search, ArrowLeft, ArrowRight } from "lucide-react";
import { ZodError } from "zod";
import { Button } from "@/shared";
import { fetchPage } from "./fetchPage";
import { Grid } from "./Grid";
import { ErrorState } from "./ErrorState";
import type { Result, Info, ApiResponse } from "./schema";
import styles from "./Browser.module.css";

const { layout, header, label, titleGroup, title, subTitle, searchBar, srOnly, search, pagination, pageInfo } = styles;

const TTL = 5 * 60 * 1000;
const cache = new Map<string, { data: ApiResponse; timestamp: number }>();

function pushPage(page: number, name: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (name) params.set("name", name);
  window.history.pushState(null, "", `?${params.toString()}`);
}

function getUrlParam(key: string) {
  return new URLSearchParams(window.location.search).get(key) ?? "";
}

export function Browser() {
  const id = useId();
  const [page, setPage] = useState(() => Number(getUrlParam("page")) || 1);
  const [results, setResults] = useState<Result[]>([]);
  const [info, setInfo] = useState<Info | null>(null);
  const [query, setQuery] = useState(() => getUrlParam("name"));
  const [debouncedQuery, setDebouncedQuery] = useState(() => getUrlParam("name"));
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [srAnnouncement, setSrAnnouncement] = useState("");
  const srAnnouncementTimeoutId = useRef<number>(null);
  const prevQueryRef = useRef(getUrlParam("name"));
  const preSearchPageRef = useRef<number | null>(null);
  const SkeletonCount = info && page === info.pages ? info.count % 20 || 20 : 20;

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    const isNewQuery = debouncedQuery !== "" && debouncedQuery !== prevQueryRef.current;
    prevQueryRef.current = debouncedQuery;
    const cacheKey = `${isNewQuery ? 1 : page}-${debouncedQuery}`;
    if (isNewQuery && preSearchPageRef.current === null) {
      preSearchPageRef.current = page;
    }
    if (!debouncedQuery && preSearchPageRef.current !== null) {
      const restoredPage = preSearchPageRef.current;
      preSearchPageRef.current = null;
      setPage(restoredPage);
    }

    function scheduleSrAnnouncementReset() {
      clearTimeout(srAnnouncementTimeoutId.current ?? undefined);
      srAnnouncementTimeoutId.current = setTimeout(() => setSrAnnouncement(""), 3000);
    }

    function setError(errorMessage: string) {
      setErrorMessage(errorMessage);
      setSrAnnouncement(errorMessage);
      scheduleSrAnnouncementReset();
    }

    async function run() {
      if (cache.has(cacheKey)) {
        const entry = cache.get(cacheKey)!;
        if (Date.now() - entry.timestamp < TTL) {
          setResults(entry.data.results);
          setInfo(entry.data.info);
          setStatus("success");
          if (isNewQuery) setPage(1);
          pushPage(isNewQuery ? 1 : page, debouncedQuery);
          setSrAnnouncement(`Page ${isNewQuery ? 1 : page} loaded — ${entry.data.results.length} characters`);
          return;
        }
        cache.delete(cacheKey);
      }
      try {
        setStatus("loading");
        const data = await fetchPage(isNewQuery ? 1 : page, debouncedQuery, controller.signal);
        setResults(data.results);
        setInfo(data.info);
        setStatus("success");
        if (isNewQuery) setPage(1);
        pushPage(isNewQuery ? 1 : page, debouncedQuery);
        setSrAnnouncement(`Page ${isNewQuery ? 1 : page} loaded — ${data.results.length} characters`);
        cache.set(cacheKey, { data, timestamp: Date.now() });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (error instanceof TypeError) {
          setError("Something went wrong. Check your internet connection and try again");
        } else if (error instanceof ZodError) {
          setError("Received unexpected data from the API. Please try again");
        } else if (error instanceof Error) {
          if (error.message.includes("404")) {
            setError("No characters found. Try a different search.");
          } else if (error.message.includes("429")) {
            setError("Too many requests. Please slow down.");
          } else {
            setError("An unexpected error occurred. Please try again");
          }
        } else {
          setError("An unexpected error occurred. Please try again");
        }
        setStatus("error");
      }
    }

    run();
    return () => controller.abort();
  }, [page, debouncedQuery]);

  useEffect(() => {
    function handlePopstate() {
      const params = new URLSearchParams(window.location.search);
      setPage(Number(params.get("page")) || 1);
    }

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  return (
    <div className={layout}>
      <header className={header}>
        <div className={titleGroup}>
          <p className={label}>Rick and Morty</p>
          <h1 className={title}>Character Browser</h1>
          {info && (
            <p className={subTitle}>
              <strong>{info.count}</strong> characters • <strong>{info.pages}</strong> pages
            </p>
          )}
        </div>
        <div className={searchBar}>
          <Search size={16} />
          <label className={srOnly} htmlFor={id}>
            Search characters
          </label>
          <input
            className={search}
            id={id}
            type="search"
            placeholder="Search characters..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            autoComplete="off"
            autoFocus
          />
        </div>
      </header>
      <p role="alert" className={srOnly}>
        {srAnnouncement}
      </p>
      {status === "error" ? (
        <ErrorState message={errorMessage} />
      ) : (
        <>
          <Grid results={results} status={status} skeletonCount={SkeletonCount} />
          <nav className={pagination} aria-label="Pagination">
            <Button
              onClick={() => {
                const newPage = page - 1;
                setPage(newPage);
              }}
              disabled={page === 1 || status === "loading"}
            >
              <ArrowLeft />
              Prev
            </Button>
            {info && (
              <p className={pageInfo}>
                Page <strong>{page}</strong> of <strong>{info.pages}</strong>
              </p>
            )}
            <Button
              onClick={() => {
                const newPage = page + 1;
                setPage(newPage);
              }}
              disabled={page === info?.pages || status === "loading"}
            >
              Next
              <ArrowRight />
            </Button>
          </nav>
        </>
      )}
    </div>
  );
}
