import type { StoreSearchResult } from "../../store/types";

interface SearchResultsProps {
  results: StoreSearchResult[];
}

/**
 * Renders a list of document chunk results from a search query.
 */
const SearchResults = ({ results }: SearchResultsProps) => {
  if (results.length === 0) {
    return (
      <p class="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
        No results found.
      </p>
    );
  }

  return (
    <div class="space-y-3 animate-[fadeSlideIn_0.2s_ease-out]">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </p>
      {results.map((result, i) => (
        <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
          {/* Header row: index, URL, score */}
          <div class="flex items-start justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2 min-w-0">
              <span class="shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums">
                #{i + 1}
              </span>
              <span
                safe
                class="text-xs font-mono text-primary-700 dark:text-primary-300 break-all"
              >
                {result.url}
              </span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              {result.score !== null ? (
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  score: {result.score.toFixed(4)}
                </span>
              ) : null}
              {result.mimeType ? (
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  <span safe>{result.mimeType}</span>
                </span>
              ) : null}
            </div>
          </div>

          {/* Content block */}
          <pre class="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded p-3 overflow-x-auto max-h-64 whitespace-pre-wrap break-words font-mono leading-relaxed">
            <span safe>{result.content}</span>
          </pre>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
